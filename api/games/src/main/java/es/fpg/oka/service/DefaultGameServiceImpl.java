package es.fpg.oka.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Level;
import es.fpg.oka.model.Player;

@Service
public class DefaultGameServiceImpl implements DefaultGameService {

	@Autowired
	private DefaultData data;
	
	@Override
	public int getDefaultGameDice() {
		return data.getBoard().getDice();
	}
	
	@Override
	public BoardConfiguration createDefaultBoardConfiguration() {
		BoardConfiguration boardConf = new BoardConfiguration();
		boardConf.setDice(data.getBoard().getDice());
		boardConf.setNcells(data.getBoard().getNcells());
		boardConf.setOkaGap(data.getBoard().getOkaGap());
		
		int nLevels = Level.values().length;
		int sizePerLevel = data.getBoard().getNcells() / nLevels;
		Integer [] levels = new Integer[nLevels];
		Arrays.fill(levels, sizePerLevel);
		boardConf.setLevels(levels);
		
		return boardConf;
	}
	
	@Override
	public List<Player> createDefaultPlayers() {
		return data.getPlayers();
	}
}
