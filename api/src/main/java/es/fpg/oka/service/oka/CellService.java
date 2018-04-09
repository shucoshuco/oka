package es.fpg.oka.service.oka;

import java.util.List;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Cell;

public interface CellService {
	
	List<Cell> getCells(BoardConfiguration configuration);
	Cell getCell(long idCell);
	Cell getOka(boolean itemsPending);
}
