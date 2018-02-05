package es.fpg.oka.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.User;
import es.fpg.oka.repository.UserRepository;
import es.fpg.oka.service.UserService;

@Service
public class UserServiceImpl extends SecuredServiceBase implements UserService {

	@Autowired
	private UserRepository repository;
	
	@Override
	public User getUser(String id) {
		return repository.findOne(id);
	}

	@Override
	public User getCurrentUser() {
		return repository.findOne(getCurrentPrincipalId());
	}

	@Override
	public User createUser(User user) {
		return repository.insert(user);
	}

	@Override
	public User updateUser(User user) {
		return repository.save(user);
	}

	@Override
	public void deleteUser(String id) {
		repository.delete(id);
	}
}
