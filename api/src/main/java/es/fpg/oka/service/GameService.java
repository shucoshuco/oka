package es.fpg.oka.service;

import java.util.List;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Game;
import es.fpg.oka.model.Movement;
import es.fpg.oka.model.Player;

public interface GameService {

	Movement rollDice(String id);
	
	Game getGame(String id);
	Game createGame(List<Cell> board, List<Player> players, Integer dice);
	Game createGame(BoardConfiguration configuration, List<Player> players);
	Game createGame(long idConf);
	void deleteGame(String id);
}
