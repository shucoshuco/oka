package es.fpg.oka.model.dices;

import lombok.Data;

@Data
public class Movement {

	private int positionDice;
	private int timeDice;
	
	private Position position;
	private Time time;
}
