package es.fpg.oka.model;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Cell implements Cloneable {

	@Id
	private long id;
	private String title;
	private String description;
	private int position;
	private int level;
	private boolean oka;
	private int nitems;
	private String cellId;
}
