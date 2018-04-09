package es.fpg.oka.security;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import es.fpg.oka.model.common.User;
import lombok.Getter;

public class CustomPrincipal implements UserDetails {

	private static final long serialVersionUID = 1L;

	@Getter
	private String id;
	@Getter
	private String username;
	@Getter
	private String password;
	@Getter
	private Locale language;
	@Getter
	private LocalDate endSubscription;
	@Getter
	private Collection<? extends GrantedAuthority> authorities;
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	@Override
	public boolean isEnabled() {
		return true;
	}
	
	static CustomPrincipal fromUser(User user) {
		CustomPrincipal principal = new CustomPrincipal();
		principal.id = user.getId();
		principal.username = user.getName();
		principal.password = user.getPassword();
		principal.language = user.getLanguage();
		principal.endSubscription = user.getEndSubscription();
		if (user.getRoles() != null) {
			principal.authorities =
					Arrays.stream(user.getRoles())
		    			.map(s -> "ROLE_" + s)
		    			.map(SimpleGrantedAuthority::new)
		    			.collect(Collectors.toList());
		} else {
			principal.authorities = Collections.emptyList();
		}
		
		return principal;
	}
}
