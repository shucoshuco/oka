package es.fpg.oka.model;

import lombok.Data;

@Data
public class Cell implements Cloneable {

	private String id;
	private int position;
	private int level;
	private boolean oka;
	private int nitems;
	private String thumbnailUrl;
}
