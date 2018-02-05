package es.fpg.oka.model;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Game {

	@Id
	private String id;
	
	private Instant creationDate;
	private Instant lastUpdate;
	
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
	
	public int getCurrentLevel() {
		int maxCell = 0;
		for (Player p : status.getPlayers()) {
			if (p.getPosition() > maxCell) {
				maxCell = p.getPosition();
			}
		}
		return maxCell == 0 ? Level.WARM_UP.ordinal() : board.get(maxCell).getLevel();
	}
}
