package es.fpg.oka.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Level;
import es.fpg.oka.repository.CellRepository;

@Service
public class CellServiceImpl implements CellService {

	@Value("${cell.oka.title}")
	private String okaTitle;
	
	@Value("${cell.oka.description}")
	private String okaDescription;
	
	@Value("${cell.oka.imageUrl}")
	private String okaImageUrl;
	
	@Autowired
	private CellRepository repository;
	
	@Override
	public Cell getCell(String id) {
		return repository.findOne(id);
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
			orig.setImageUrl(okaImageUrl);
			orig.setOka(true);
			orig.setNitems(1);
			
			if (orig.getLevel() == Level.GO.ordinal()) {
				break;
			}
		}
	}
}