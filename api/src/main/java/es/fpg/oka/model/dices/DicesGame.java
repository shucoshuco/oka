package es.fpg.oka.model.dices;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document
public class DicesGame {

	@Id
	private String id;
	private String userId;
	
	private Position [] positions;
	private Time [] times;
}
