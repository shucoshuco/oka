package es.fpg.oka.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Game;
import es.fpg.oka.model.GameStatus;
import es.fpg.oka.model.Movement;
import es.fpg.oka.model.Movement.Jump;
import es.fpg.oka.model.Player;
import es.fpg.oka.repository.GameRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GameServiceImpl implements GameService {

	private final static Random RANDOM = new Random();

	@Autowired
	private GameRepository repository;
	
	@Autowired
	private CellService cellsService;
	
	@Autowired
	private BoardConfigurationService boardConfsService;
	
	@Autowired
	private DefaultGameService defaultGame;
	
	@Override
	public List<Game> userGames(long userId) {
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
		return repository.findOne(id);
	}
	
	@Override
	public Movement rollDice(String id) {
		Game game = repository.findOne(id);
		int dice = game == null ? defaultGame.getDefaultGameDice() : game.getDice();
		int nCells = (RANDOM.nextInt(dice * 3) + 2) / 3;
		return move(game, nCells);
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
	public Game createGame(long userId, List<Cell> board, List<Player> players, Integer dice) {
		Game game = new Game();
		game.setUserId(userId);
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
				configuration.getUserId(),
				cellsService.getCells(configuration),
				configuration.getPlayers(),
				configuration.getDice());
	}
	
	@Override
	public Game createGame(long idConf) {
		BoardConfiguration board = boardConfsService.getConfiguration(idConf);
		return createGame(board);
	}
	
	public Game createGameWithDefaultConfiguration(String idConf) {
		log.info("Executing fallback method createGameWithDefaultConfiguration");
		BoardConfiguration configuration = defaultGame.createDefaultBoardConfiguration();
		configuration.setPlayers(defaultGame.createDefaultPlayers());
		return createGame(configuration);
	}
	
	@Override
	public void deleteGame(String id) {
		repository.delete(id);
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
			if (toCell.isOka() && current.getNitems() == 0) {
				position = findNextOka(game, movement, current.getPosition(), position);
			} else {
				current.setNitems(current.getNitems() - toCell.getNitems());
			}
		}
		current.setPosition(position);
		
		movement.setTo(position);
		movement.setPlayer(status.currentPlayer());
		movement.setToCell(game.getBoard().get(position));
		status.nextTurn();
		movement.setNextTurn(status.getTurn());
		movement.setStatus(status);
		
		game.setLastUpdate(Instant.now());
		repository.save(game);
		return movement;
	}

	private int findNextOka(Game game, Movement movement, int initialPos, int currentPosition) {
		Optional<Cell> nextOka = 
				game.getBoard().stream()
					.skip(currentPosition + 1)
					.filter(c -> c.isOka())
					.findFirst();
		
		if (!nextOka.isPresent()) {
			return currentPosition;
		}
		
		Jump jump = new Jump();
		jump.setFrom(initialPos);
		jump.setTo(currentPosition);
		jump.setToCell(game.getBoard().get(currentPosition));
		movement.setJumpInfo(jump);

		return nextOka.get().getPosition();
	}
}
