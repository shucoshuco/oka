package es.fpg.oka.service.oka;

import java.util.List;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.OkaGame;
import es.fpg.oka.model.oka.Movement;
import es.fpg.oka.model.oka.Player;

public interface OkaGameService {

	List<OkaGame> userGames();

	Movement rollDice(String id);
	
	OkaGame getGame(String id);
	String createGame(List<Cell> board, List<Player> players, Integer dice);
	String createGame(BoardConfiguration configuration);
	String createGame(long idConf);
	String createAnonymousGame();
	void deleteGame(String id);
}
