package es.fpg.oka.model.common;

import lombok.Data;

@Data
public class UserRegistration {
	
	private String username;
	private String password;
	private String confirmPassword;
	private Gender gender;
}
