package es.fpg.oka.service.common;

import java.util.List;

import es.fpg.oka.model.common.Game;

public interface GamesSummaryService {

	List<Game> getAvailableGames();
	List<Game> getMostPlayedGames();
	List<Game> getCurrentUserMostPlayedGames();
	void addHitForGame(String gameId);
}