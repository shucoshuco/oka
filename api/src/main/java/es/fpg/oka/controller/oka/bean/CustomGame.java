package es.fpg.oka.controller.oka.bean;

import java.util.List;

import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.Player;
import lombok.Data;

@Data
public class CustomGame {
	
	private List<Cell> board;
	private List<Player> players;
	private Integer dice;
}
