package es.fpg.oka.model;

import java.util.Date;
import java.util.Locale;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class User {

	@Id
	private String id;
	private String name;
	private Locale language;
	private Date endSubscription;
	private Gender gender;
}
