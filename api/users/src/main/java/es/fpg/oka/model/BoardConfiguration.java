package es.fpg.oka.model;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.ArrayUtils;
import org.springframework.data.annotation.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
public class BoardConfiguration {

	@Getter @Setter @Id
	private String id;
	
	@Getter @Setter
	private String userId;
	
	@Getter @Setter
	private String name;
	
	@Getter @Setter
	private int ncells;
	
	@Getter @Setter
	private Integer dice;
	
	@Getter @Setter
	private int okaGap;
	
	@Getter
	private Integer[] levels = new Integer[Level.values().length];

	@Getter @Setter
	private List<Player> players = new ArrayList<>();
	
	public BoardConfiguration(int ncells, int okaGap) {
		this.ncells = ncells;
		this.okaGap = okaGap;
	}
	
	public void setLevels(Integer [] levels) {
		if (!ArrayUtils.isSameLength(levels, Level.values())) {
			throw new IllegalArgumentException("Levels must be an array of " + Level.values().length + " elements");
		}
		this.levels = levels;
	}
	
	public void putLevel(Level level, int n) {
		levels[level.ordinal()] = n;
	}
	
	public Integer getLevel(Level level) {
		return levels[level.ordinal()];
	}
	
	public void addPlayer(Player player) {
		players.add(player);
	}
}
