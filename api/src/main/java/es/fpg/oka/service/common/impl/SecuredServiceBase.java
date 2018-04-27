package es.fpg.oka.service.common.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import es.fpg.oka.security.CustomPrincipal;
import es.fpg.oka.service.common.UserService;

public class SecuredServiceBase {

	@Autowired
	protected UserService userService;

	protected SecuredServiceBase() { }
	
	protected CustomPrincipal getCurrentAuthenticatedPrincipal() {
		if (!isAuthenticated()) {
			throw new InsufficientAuthenticationException("User not authenticated");
		}
		return (CustomPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
	
	protected boolean validUser(String userId) {
		return StringUtils.equals(userId, getCurrentAuthenticatedPrincipal().getId());
	}
	
	protected boolean isAuthenticated() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
	}
	
	protected String getCurrentPrincipalOrAnonymousId() {
		return isAuthenticated() ? getCurrentAuthenticatedPrincipal().getId() : null;
	}
	
	protected boolean validUserOrAnonymous(String userId) {
		return StringUtils.equals(userId, getCurrentPrincipalOrAnonymousId());
	}	
}
