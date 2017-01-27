package es.fpg.oka.service;

import java.util.List;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;

public interface CellService {
	
	List<Cell> getCells(BoardConfiguration configuration);
	Cell getCell(String idCell);
}
