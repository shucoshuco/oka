package es.fpg.oka.service;

import es.fpg.oka.model.User;

public interface UserService {

	User getCurrentUser();
	User getUser(String id);
	User createUser(User user);
	User updateUser(User user);
	void deleteUser(String id);
}
