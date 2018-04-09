package es.fpg.oka.model.common;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class User {

	@Id
	private String id;
	private String name;
	private String password;
	private Locale language;
	private Gender gender;
	private LocalDate registerDate;
	private LocalDate endSubscription;
	private String [] roles;
	private Instant lastAccess;
	private Instant nextLastAccess;
}
