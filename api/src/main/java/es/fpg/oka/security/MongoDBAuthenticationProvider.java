package es.fpg.oka.security;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.common.User;
import es.fpg.oka.repository.common.UserRepository;

@Service
public class MongoDBAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
    	if (!passwordEncoder.matches((String) authentication.getCredentials(), userDetails.getPassword())) {
    		throw new BadCredentialsException(messages.getMessage(
					"AbstractUserDetailsAuthenticationProvider.badCredentials",
					"Bad credentials"));
    	}
    }
    
    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
    	User user = userRepository.findByName(username);
    	if (user == null) {
    		throw new UsernameNotFoundException("Username not found: " + username);
    	}
    	user.setLastAccess(user.getNextLastAccess());
    	user.setNextLastAccess(Instant.now());
    	userRepository.save(user);
    	return CustomPrincipal.fromUser(user);
    }
}
