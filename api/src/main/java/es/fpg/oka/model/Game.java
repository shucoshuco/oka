package es.fpg.oka.model;

import java.util.Collections;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Game {

	@Id
	private String id;
	
	private String userId;
	private int dice;
	private List<Cell> board;
	private GameStatus status;
	
	public void initializeStatus(List<Player> players) {
		status = new GameStatus();
		status.setFinished(false);
		status.setTurn(0);
		Collections.shuffle(players);
		players.forEach(u -> u.setPosition(0));
		status.setPlayers(players);
	}
}
