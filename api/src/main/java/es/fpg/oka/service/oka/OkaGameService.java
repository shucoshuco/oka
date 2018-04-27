package es.fpg.oka.service.oka;

import java.util.List;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.Movement;
import es.fpg.oka.model.oka.OkaGame;
import es.fpg.oka.model.oka.Player;
import es.fpg.oka.service.common.GameService;

public interface OkaGameService extends GameService {

	Movement rollDice(String id);
	
	OkaGame getGame(String id);
	void createGame(String gameId, List<Cell> board, List<Player> players, Integer dice);
	void createGame(String gameId, BoardConfiguration configuration);
	void createGame(String gameId, long idConf);
	void createGame(String gameId);
	void createAnonymousGame(String gameId);
	void deleteGame(String id);
}
