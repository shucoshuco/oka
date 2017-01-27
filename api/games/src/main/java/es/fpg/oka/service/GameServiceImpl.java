package es.fpg.oka.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.BoardConfigurationWrapper;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Game;
import es.fpg.oka.model.GameStatus;
import es.fpg.oka.model.Movement;
import es.fpg.oka.model.Movement.Jump;
import es.fpg.oka.model.Player;
import es.fpg.oka.repository.BoardConfigurationsClient;
import es.fpg.oka.repository.CellsClient;
import es.fpg.oka.repository.GameRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GameServiceImpl implements GameService {

	private final static Random RANDOM = new Random();

	@Autowired
	private GameRepository repository;
	
	@Autowired
	private CellsClient cellsClient;
	
	@Autowired
	private BoardConfigurationsClient boardConfsClient;
	
	@Autowired
	private DefaultGameService defaultGame;
	
	@Override
	public Game getGame(String id) {
		return repository.findOne(id);
	}
	
	@Override
	public int rollDice(String id) {
		Game game = repository.findOne(id);
		int dice = game == null ? defaultGame.getDefaultGameDice() : game.getDice();
		return (RANDOM.nextInt(dice * 3) + 2) / 3;
	}
	
	private int initializeDice(List<Cell> board, Integer dice) {
		return dice == null ? board.size() / 20 : dice;
	}
	
	private List<Cell> initializeBoard(List<Cell> board) {
		for (int i = 0; i < board.size(); i++) {
			board.get(i).setPosition(i);
		}
		return board;
	}
	
	@Override
	public Game createGame(List<Cell> board, List<Player> players, Integer dice) {
		Game game = new Game();
		game.setBoard(initializeBoard(board));
		game.initializeStatus(players);
		game.setDice(initializeDice(board, dice));
		repository.insert(game);
		return game;
	}

	@Override
	public Game createGame(BoardConfiguration configuration, List<Player> players) {
		return createGame(cellsClient.cells(configuration), players, configuration.getDice());
	}
	
	@Override
	@HystrixCommand(fallbackMethod = "createGameWithDefaultConfiguration")
	public Game createGame(String idConf) {
		BoardConfigurationWrapper board = boardConfsClient.getConfiguration(idConf);
		return createGame(board, board.getPlayers());
	}
	
	public Game createGameWithDefaultConfiguration(String idConf) {
		log.info("Executing fallback method createGameWithDefaultConfiguration");
		BoardConfiguration configuration = defaultGame.createDefaultBoardConfiguration();
		List<Player> players = defaultGame.createDefaultPlayers();
		return createGame(configuration, players);
	}
	
	@Override
	public void deleteGame(String id) {
		repository.delete(id);
	}

	@Override
	public Movement move(String idGame, int nCells) {
		Game game = getGame(idGame);
		if (game == null) {
			return null;
		}
		
		GameStatus status = game.getStatus();
		Player current = status.currentPlayer();
		int position = current.getPosition() + nCells;
		
		Movement movement = new Movement();
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
