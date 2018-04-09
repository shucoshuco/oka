package es.fpg.oka.model.oka;

import java.util.List;

import lombok.Data;

@Data
public class GameStatus {
	
	private List<Player> players;
	private int turn;
	private boolean finished;
	private int winner;
	
	public void nextTurn() {
		turn = turn == players.size() - 1 ? 0 : turn + 1;
	}
	
	public Player currentPlayer() {
		return players.get(turn);
	}
}
