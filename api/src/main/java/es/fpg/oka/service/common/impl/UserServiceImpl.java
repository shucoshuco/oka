package es.fpg.oka.service.common.impl;

import java.time.Instant;
import java.time.LocalDate;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.common.User;
import es.fpg.oka.model.common.UserRegistration;
import es.fpg.oka.repository.common.UserRepository;
import es.fpg.oka.service.common.UserService;

@Service
public class UserServiceImpl extends SecuredServiceBase implements UserService {

	@Autowired
	private UserRepository repository;
	
    @Autowired
    private PasswordEncoder passwordEncoder;

	@Override
	public User getUser(String id) {
		return repository.findOne(id);
	}

	@Override
	public User getCurrentUser() {
		return repository.findOne(getCurrentAuthenticatedPrincipal().getId());
	}
	
	@Override
	public User updateUser(User user) {
		return repository.save(user);
	}
	
	private void validateUserRegistration(UserRegistration user) {
		if (StringUtils.isEmpty(user.getUsername())) {
			throw new IllegalArgumentException("Username required");
		}
		if (StringUtils.isEmpty(user.getPassword())) {
			throw new IllegalArgumentException("Password required");
		}
		if (!user.getPassword().equals(user.getConfirmPassword())) {
			throw new IllegalArgumentException("Passowords don't match");
		}
		if (user.getGender() == null) {
			throw new IllegalArgumentException("Gender is required");
		}
	}
	
	private boolean existsUser(String userName) {
		return repository.findByName(userName) != null;
	}
	
	public void copyData(UserRegistration source, User dest) {
		dest.setName(source.getUsername());
		dest.setPassword(passwordEncoder.encode(source.getPassword()));
		dest.setGender(source.getGender());
	}

	@Override
	public User createUser(UserRegistration user) {
		validateUserRegistration(user);
		if (existsUser(user.getUsername())) {
			throw new IllegalArgumentException("User " + user.getUsername() + " already exists");
		}
		User newUser = new User();
		copyData(user, newUser);
		newUser.setRoles(new String[] {"USER"});
		newUser.setNextLastAccess(Instant.now());
		newUser.setRegisterDate(LocalDate.now());
		return repository.insert(newUser);
	}

	@Override
	public User updateUser(String id, UserRegistration user) {
		User oldUser = repository.findOne(id);
		if (oldUser == null) {
			return null;
		}
		validateUserRegistration(user);
		copyData(user, oldUser);
		return repository.save(oldUser);
	}

	@Override
	public void deleteUser(String id) {
		repository.delete(id);
	}
}
