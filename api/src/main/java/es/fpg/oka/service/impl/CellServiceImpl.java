package es.fpg.oka.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Level;
import es.fpg.oka.repository.CellRepository;
import es.fpg.oka.service.CellService;

@Service
public class CellServiceImpl implements CellService {

	@Value("${cells.cell.oka.title}")
	private String okaTitle;
	
	@Value("${cells.cell.oka.description}")
	private String okaDescription;
	
	@Value("${cells.cell.oka.cellId}")
	private String okaCellId;
	
	@Value("${cells.cell.oka-no-item.title}")
	private String okaNoItemTitle;
	
	@Value("${cells.cell.oka-no-item.description}")
	private String okaNoItemDescription;
	
	@Value("${cells.cell.oka-no-item.cellId}")
	private String okaNoItemCellId;
	
	@Autowired
	private CellRepository repository;
	
	private Cell okaCell;
	private Cell okaNoItemCell;
	
	@PostConstruct
	public void initialize() {
		okaCell = createOkaCell(0, Level.LIGHT.ordinal());
		okaNoItemCell = createOkaNoItemCell(0, Level.LIGHT.ordinal());
	}
	
	private Cell createOkaCell(int position, int level) {
		Cell cell = new Cell();
		cell.setTitle(okaTitle);
		cell.setDescription(okaDescription);
		cell.setOka(true);
		cell.setNitems(1);
		cell.setCellId(okaCellId);
		cell.setPosition(position);
		cell.setLevel(level);
		return cell;
	}
	
	private Cell createOkaNoItemCell(int position, int level) {
		Cell cell = createOkaCell(position, level);
		cell.setTitle(okaNoItemTitle);
		cell.setDescription(okaNoItemDescription);
		cell.setOka(true);
		cell.setNitems(0);
		cell.setCellId(okaNoItemCellId);
		return cell;
	}
	
	@Override
	public Cell getCell(long id) {
		return repository.findOne(id);
	}

	@Override
	public Cell getOka(boolean itemsPending) {
		return itemsPending ? okaCell : okaNoItemCell;
	}

	@Override
	public List<Cell> getCells(BoardConfiguration configuration) {

		fixBoardConfiguration(configuration);

		List<Cell> cells = new ArrayList<>(configuration.getNcells());
		for (Level l : Level.values()) {
			List<Cell> levelCells = repository.findByLevel(l.ordinal());
			Collections.shuffle(levelCells);
			int toIndex = Math.min(configuration.getLevel(l), levelCells.size());
			cells.addAll(levelCells.subList(0, toIndex));
		}

		addOkas(configuration, cells);

		return cells;
	}
	
	private void fixBoardConfiguration(BoardConfiguration configuration) {
		
		if (configuration == null) {
			throw new IllegalArgumentException("Configuration can't be null");
		}
		
		Set<Level> empty = new TreeSet<>(); 
		int notEmpty = 0;
		for (Level l : Level.values()) {
			if (!configuration.containsLevel(l)) {
				empty.add(l);
			} else {
				notEmpty += configuration.getLevel(l);
			}
		}
		
		if (!empty.isEmpty()) {
			int nRest = configuration.getNcells() - notEmpty;
			int nCellsEmpty = nRest / empty.size();
			empty.forEach(l -> configuration.putLevel(l, nCellsEmpty));
			notEmpty += nCellsEmpty * empty.size();
		}
		
		// If sum of all cells is less than total number, we added it in the last level
		if (notEmpty < configuration.getNcells()) {
			int nGo = configuration.getLevel(Level.GO);
			configuration.putLevel(Level.GO, nGo + configuration.getNcells() - notEmpty);
		}
	}
	
	private void addOkas(BoardConfiguration configuration, List<Cell> cells) {
		for (int i = configuration.getOkaGap() - 1; i < cells.size(); i += configuration.getOkaGap()) {
			Cell orig = cells.get(i);
			if (orig.getLevel() == Level.GO.ordinal()) {
				break;
			}
			cells.set(i, createOkaCell(orig.getPosition(), orig.getLevel()));
		}
	}
}