package es.fpg.oka;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

	public static void main(String[] args) {
		System.out.println(new BCryptPasswordEncoder().encode("felix"));
	}
}
