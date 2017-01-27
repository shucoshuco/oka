package es.fpg.oka.controller;

import java.util.List;

import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Player;
import lombok.Data;

@Data
public class CustomGame {
	
	private List<Cell> board;
	private List<Player> players;
	private Integer dice;
}
