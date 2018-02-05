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
	
	@Autowired
	private CellRepository repository;
	
	private Cell okaCell;
	
	@PostConstruct
	public void createOkaCell() {
		okaCell = new Cell();
		okaCell.setTitle(okaTitle);
		okaCell.setDescription(okaDescription);
		okaCell.setOka(true);
		okaCell.setNitems(1);
		okaCell.setCellId("oka");
	}
	
	@Override
	public Cell getCell(long id) {
		return repository.findOne(id);
	}

	@Override
	public Cell getOka() {
		return okaCell;
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
		for (int i = configuration.getOkaGap(); i < cells.size(); i += configuration.getOkaGap()) {
			Cell orig = cells.get(i);
			orig.setTitle(okaTitle);
			orig.setDescription(okaDescription);
			orig.setOka(true);
			orig.setNitems(1);
			
			if (orig.getLevel() == Level.GO.ordinal()) {
				break;
			}
		}
	}
}