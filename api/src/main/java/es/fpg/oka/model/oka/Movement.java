package es.fpg.oka.model.oka;

import lombok.Data;

@Data
public class Movement {

	private int dice;
	private boolean end;
	private int turn;
	private int nextTurn;
	private int from;
	private int to;
	private int nitems;
	private Jump jumpInfo;
	private GameStatus status;
	
	@Data
	public static class Jump {
		
		private int from;
		private int to;
	}
	
	public boolean isJump() {
		return jumpInfo != null;
	}
}
