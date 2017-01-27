package es.fpg.oka.model;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Cell {

	@Id
	private String id;
	
	private int level;
	private boolean oka;
	private int nitems;
	private String title;
	private String description;
	private String imageUrl;
	private String thumbnailUrl;
}
