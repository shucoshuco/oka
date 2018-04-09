package es.fpg.oka.model.oka;

import es.fpg.oka.model.common.Gender;
import lombok.Data;

@Data
public class Player {

	private String name;
	private String alias;
	private Gender gender;
	private int nitems;
	private int position;
}
