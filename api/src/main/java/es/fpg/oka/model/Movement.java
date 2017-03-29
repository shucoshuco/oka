package es.fpg.oka.model;

import lombok.Data;

@Data
public class Movement {

	private int dice;
	private boolean end;
	private int turn;
	private int nextTurn;
	private int from;
	private int to;
	private Jump jumpInfo;
	private Player player;
	private Cell toCell;
	private GameStatus status;
	
	@Data
	public static class Jump {
		
		private int from;
		private int to;
		private Cell toCell;
	}
	
	public boolean isJump() {
		return jumpInfo != null;
	}
}
