package es.fpg.oka.service;

import java.util.List;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Player;

public interface DefaultGameService {

	int getDefaultGameDice();
	BoardConfiguration createDefaultBoardConfiguration();
	List<Player> createDefaultPlayers();
}
