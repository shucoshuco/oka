package es.fpg.oka.service.oka;

import java.util.List;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Player;

public interface DefaultGameService {

	int getDefaultGameDice();
	BoardConfiguration createDefaultBoardConfiguration();
	List<Player> createDefaultPlayers();
}
