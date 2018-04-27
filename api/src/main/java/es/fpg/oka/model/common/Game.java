package es.fpg.oka.model.common;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Game {

	@Id
	private String id;
	private String name;
	private String description;
	private String image;
	private long hits;
}
