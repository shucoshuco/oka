package es.fpg.oka.service.dices;

import es.fpg.oka.model.dices.DicesGame;
import es.fpg.oka.model.dices.Movement;
import es.fpg.oka.service.common.GameService;

public interface DicesGameService extends GameService {

	DicesGame getGame(String idGame);
	void createGame(String idGame);
	Movement rollDice(String idGame);
	void deleteGame(String lastGame);
}
