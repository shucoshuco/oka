package es.fpg.oka.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Game;
import es.fpg.oka.model.GameStatus;
import es.fpg.oka.model.Movement;
import es.fpg.oka.model.Movement.Jump;
import es.fpg.oka.model.Player;
import es.fpg.oka.repository.GameRepository;
import es.fpg.oka.security.CustomPrincipal;
import es.fpg.oka.service.BoardConfigurationService;
import es.fpg.oka.service.CellService;
import es.fpg.oka.service.DefaultGameService;
import es.fpg.oka.service.GameService;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GameServiceImpl extends SecuredServiceBase implements GameService {

	private final static Random RANDOM = new Random();

	@Autowired
	private GameRepository repository;
	
	@Autowired
	private CellService cellsService;
	
	@Autowired
	private BoardConfigurationService boardConfsService;
	
	@Autowired
	private DefaultGameService defaultGame;
	
	@Autowired
	private AuthenticationTrustResolver authResolver;
	
	protected String getCurrentPrincipalOrAnonymousId() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth == null || authResolver.isAnonymous(auth)
				? null
				: ((CustomPrincipal) auth.getPrincipal()).getId();
	}
	
	protected boolean validUserOrAnonymous(String userId) {
		return StringUtils.equals(userId, getCurrentPrincipalOrAnonymousId());
	}	
	
	@Override
	public List<Game> userGames() {
		String userId = getCurrentPrincipalId();
		log.debug("Looking for games of user {}", userId);
		return repository.findByUserId(userId)
				.stream()
				.filter(g -> !g.getStatus().isFinished())
				.collect(Collectors.toList());
	}
	
	@Override
	public Game getGame(String id) {
		log.debug("Looking for game {}", id);
		log.debug("Game: {}", repository.findOne(id));
		Game game = repository.findOne(id);
		return validUserOrAnonymous(game.getUserId()) ? game : null;
	}
	
	@Override
	public Movement rollDice(String id) {
		Game game = getGame(id);
		if (game != null) {
			int dice = game == null ? defaultGame.getDefaultGameDice() : game.getDice();
			int nCells = 5;// (RANDOM.nextInt(dice * 3) + 2) / 3;
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
	public Game createGame(List<Cell> board, List<Player> players, Integer dice) {
		
		// TODO Remove
		players.forEach(p -> p.setNitems(1));
		
		Game game = new Game();
		game.setUserId(getCurrentPrincipalOrAnonymousId());
		game.setBoard(initializeBoard(board));
		game.initializeStatus(players);
		game.setDice(initializeDice(board, dice));
		game.setCreationDate(Instant.now());
		game.setLastUpdate(Instant.now());
		repository.insert(game);
		return game;
	}

	@Override
	public Game createGame(BoardConfiguration configuration) {
		return createGame(
				cellsService.getCells(configuration),
				configuration.getPlayers(),
				configuration.getDice());
	}
	
	@Override
	public Game createGame(long idConf) {
		BoardConfiguration board = boardConfsService.getConfiguration(idConf);
		return validUser(board.getUserId()) ? createGame(board) : null;
	}
	
	@Override
	public Game createAnonymousGame() {
		BoardConfiguration board = boardConfsService.getAnonymousConfiguration();
		return createGame(board);
	}
	
	@Override
	public void deleteGame(String id) {
		Game game = new Game();
		game.setId(id);
		game.setUserId(getCurrentPrincipalOrAnonymousId());
		repository.delete(game);
	}

	private Movement move(Game game, int nCells) {
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
		
		if (position >= game.getBoard().size() - 1) {
			// Game finished
			position = game.getBoard().size() - 1;
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

	private Optional<Jump> findNextOka(Game game, int position) {
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
