package es.fpg.oka.model;

import lombok.Data;

@Data
public class Player {

	private String name;
	private String alias;
	private Gender gender;
	private int nitems;
	private int position;
}
