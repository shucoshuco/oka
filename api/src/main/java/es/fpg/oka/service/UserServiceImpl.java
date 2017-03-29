package es.fpg.oka.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.User;
import es.fpg.oka.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository repository;
	
	@Override
	public User getUser(long id) {
		return repository.findOne(id);
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
	public void deleteUser(long id) {
		repository.delete(id);
	}
}
