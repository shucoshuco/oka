package es.fpg.oka.service.dices.impl;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.dices.DicesGame;
import es.fpg.oka.model.dices.Movement;
import es.fpg.oka.model.dices.Position;
import es.fpg.oka.model.dices.Time;
import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.Level;
import es.fpg.oka.repository.dices.DicesGameRepository;
import es.fpg.oka.repository.oka.CellRepository;
import es.fpg.oka.service.common.GamesSummaryService;
import es.fpg.oka.service.common.impl.SecuredServiceBase;
import es.fpg.oka.service.dices.DicesGameService;

@Service
public class DicesGameServiceImpl extends SecuredServiceBase implements DicesGameService {

	private final static Time [] TIMES;
	
	static {
		TIMES = new Time[6];
		TIMES[0] = new Time(10, "10 seconds");
		TIMES[1] = new Time(20, "20 seconds");
		TIMES[2] = new Time(30, "30 seconds");
		TIMES[3] = new Time(40, "40 seconds");
		TIMES[4] = new Time(50, "50 seconds");
		TIMES[5] = new Time(60, "1 minute");
	}
	
	private Random random = new Random();

	@Autowired
	private DicesGameRepository gameRepository;
	
	@Autowired
	private CellRepository cellRepository;
	
	@Autowired
	private GamesSummaryService gameService;
	
	private void createGame(String idGame, String idUser) {
		DicesGame game = new DicesGame();
		game.setId(idGame);
		game.setUserId(idUser);
		game.setPositions(new Position[6]);
		game.setTimes(TIMES);
		
		List<Cell> cells = cellRepository.findByLevel(Level.GO.ordinal());
		for (int i = 0; i < 6; i++) {
			Cell cell = cells.remove(random.nextInt(cells.size()));
			game.getPositions()[i] = convertCellToPosition(cell);
		}
		
		gameService.addHitForGame("2");
		gameRepository.save(game);		
	}
	
	@Override
	public void createAnonymousGame(String idGame) {
		createGame(idGame);
	}
	
	@Override
	public void createGame(String idGame) {
		createGame(idGame, getCurrentPrincipalOrAnonymousId());
	}

	private Position convertCellToPosition(Cell cell) {
		Position position = new Position();
		position.setName(cell.getTitle());
		position.setDescription(cell.getDescription());
		position.setUrl(cell.getCellId());
		return position;
	}
	
	@Override
	public DicesGame getGame(String idGame) {
		DicesGame game = gameRepository.findOne(idGame);
		return validUserOrAnonymous(game.getUserId()) ? game : null;
	}

	@Override
	public Movement rollDice(String idGame) {
		DicesGame game = getGame(idGame);
		
		if (!validUserOrAnonymous(game.getUserId())) {
			return null;
		}
		
		Movement mov = new Movement();
		mov.setPositionDice(random.nextInt(game.getPositions().length));
		mov.setPosition(game.getPositions()[mov.getPositionDice()]);
		
		mov.setTimeDice(random.nextInt(game.getTimes().length));
		mov.setTime(game.getTimes()[mov.getTimeDice()]);
		
		return mov;
	}

	@Override
	public void deleteGame(String lastGame) {
		gameRepository.delete(lastGame);
	}
}
