package es.fpg.oka.service;

import es.fpg.oka.model.User;

public interface UserService {

	User getUser(long id);
	User createUser(User user);
	User updateUser(User user);
	void deleteUser(long id);
}
