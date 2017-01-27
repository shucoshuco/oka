package es.fpg.oka.model;

import org.apache.commons.lang.ArrayUtils;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
public class BoardConfiguration {

	@Getter @Setter
	private int ncells;
	
	@Getter @Setter
	private Integer dice;
	
	@Getter @Setter
	private int okaGap;
	
	@Getter
	private Integer[] levels = new Integer[Level.values().length];
	
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
}
