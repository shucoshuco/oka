package es.fpg.oka.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import es.fpg.oka.security.CustomPrincipal;

public class SecuredServiceBase {

	protected SecuredServiceBase() { }
	
	protected CustomPrincipal getCurrentPrincipal() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (!auth.isAuthenticated()) {
			throw new InsufficientAuthenticationException("User not authenticated");
		}
		return (CustomPrincipal) auth.getPrincipal();
	}
	
	protected String getCurrentPrincipalId() {
		return getCurrentPrincipal().getId();
	}
	
	protected boolean validUser(String userId) {
		return StringUtils.equals(userId, getCurrentPrincipalId());
	}	
}
