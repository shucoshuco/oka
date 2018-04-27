package es.fpg.oka.service.oka.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.GameStatus;
import es.fpg.oka.model.oka.Movement;
import es.fpg.oka.model.oka.Movement.Jump;
import es.fpg.oka.model.oka.OkaGame;
import es.fpg.oka.model.oka.Player;
import es.fpg.oka.repository.oka.OkaGameRepository;
import es.fpg.oka.service.common.GamesSummaryService;
import es.fpg.oka.service.common.impl.SecuredServiceBase;
import es.fpg.oka.service.oka.BoardConfigurationService;
import es.fpg.oka.service.oka.CellService;
import es.fpg.oka.service.oka.DefaultGameService;
import es.fpg.oka.service.oka.OkaGameService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OkaGameServiceImpl extends SecuredServiceBase implements OkaGameService {

	private final static Random RANDOM = new Random();

	@Autowired
	private OkaGameRepository repository;
	
	@Autowired
	private CellService cellsService;
	
	@Autowired
	private BoardConfigurationService boardConfsService;
	
	@Autowired
	private DefaultGameService defaultGame;
	
	@Autowired
	private GamesSummaryService gameService;
	
	@Override
	public OkaGame getGame(String id) {
		log.debug("Looking for game {}", id);
		log.debug("Game: {}", repository.findOne(id));
		OkaGame game = repository.findOne(id);
		return validUserOrAnonymous(game.getUserId()) ? game : null;
	}
	
	@Override
	public Movement rollDice(String id) {
		OkaGame game = getGame(id);
		if (game != null && validUserOrAnonymous(game.getUserId())) {
			int dice = game == null ? defaultGame.getDefaultGameDice() : game.getDice();
			int nCells = (RANDOM.nextInt(dice * 3) + 2) / 3;
			return move(game, nCells);
		}
		return null;
	}
	
	private int initializeDice(List<Cell> board, Integer dice) {
		return dice == null ? board.size() / 20 : dice;
	}
	
	private List<Cell> initializeBoard(List<Cell> board) {
		Cell cell0 = new Cell();
		cell0.setLevel(0);
		cell0.setNitems(0);
		cell0.setOka(false);
		board.add(0, cell0);
		
		for (int i = 0; i < board.size(); i++) {
			board.get(i).setPosition(i);
		}
		return board;
	}
	
	@Override
	public void createGame(String gameId, List<Cell> board, List<Player> players, Integer dice) {
		
		OkaGame game = new OkaGame();
		game.setId(gameId);
		game.setUserId(getCurrentPrincipalOrAnonymousId());
		game.setBoard(initializeBoard(board));
		game.initializeStatus(players);
		game.setDice(initializeDice(board, dice));
		game.setCreationDate(Instant.now());
		game.setLastUpdate(Instant.now());
		repository.insert(game);
		
		gameService.addHitForGame("1");
	}

	@Override
	public void createGame(String gameId, BoardConfiguration configuration) {
		createGame(
				gameId,
				cellsService.getCells(configuration),
				configuration.getPlayers(),
				configuration.getDice());
	}
	
	@Override
	public void createGame(String gameId, long idConf) {
		BoardConfiguration board = boardConfsService.getConfiguration(idConf);
		if (validUser(board.getUserId())) {
			createGame(gameId, board);
		}
	}

	@Override
	public void createGame(String gameId) {
		createAnonymousGame(gameId);
	}

	@Override
	public void createAnonymousGame(String gameId) {
		BoardConfiguration board = boardConfsService.getAnonymousConfiguration();
		createGame(gameId, board);
	}
	
	@Override
	public void deleteGame(String id) {
		OkaGame game = new OkaGame();
		game.setId(id);
		game.setUserId(getCurrentPrincipalOrAnonymousId());
		repository.delete(game);
	}

	private Movement move(OkaGame game, int nCells) {
		if (game == null) {
			return null;
		}
		
		GameStatus status = game.getStatus();
		Player current = status.currentPlayer();
		int position = current.getPosition() + nCells;
		
		Movement movement = new Movement();
		movement.setDice(nCells);
		movement.setFrom(current.getPosition());
		movement.setTurn(status.getTurn());
		
		if (position >= game.getBoard().size()) {
			// Game finished
			position = game.getBoard().size();
			movement.setEnd(true);
			status.setFinished(true);
			status.setWinner(status.getTurn());
			
		} else {
			Cell toCell = game.getBoard().get(position);
			movement.setNitems(toCell.getNitems());
			if (toCell.isOka() && current.getNitems() == 0) {
				movement.setJumpInfo(findNextOka(game, position).orElse(null));
			} else {
				current.setNitems(current.getNitems() - toCell.getNitems());
				status.nextTurn();
			}
		}

		movement.setTo(position);
		movement.setNextTurn(status.getTurn());
		movement.setStatus(status);

		if (movement.isJump()) {
			current.setPosition(movement.getJumpInfo().getTo());
		} else {
			current.setPosition(position);
		}

		game.setLastUpdate(Instant.now());
		repository.save(game);
		return movement;
	}

	private Optional<Jump> findNextOka(OkaGame game, int position) {
		Optional<Cell> nextOka = 
				game.getBoard().stream()
					.skip(position + 1)
					.filter(c -> c.isOka())
					.findFirst();
		
		if (!nextOka.isPresent()) {
			return Optional.empty();
		}
		
		Jump jump = new Jump();
		jump.setFrom(position);
		jump.setTo(nextOka.get().getPosition());

		return Optional.of(jump);
	}
}
