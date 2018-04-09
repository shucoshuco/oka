package es.fpg.oka.service.common;

import es.fpg.oka.model.common.User;
import es.fpg.oka.model.common.UserRegistration;

public interface UserService {

	User getCurrentUser();
	User getUser(String id);
	User createUser(UserRegistration user);
	User updateUser(String id, UserRegistration user);
	void deleteUser(String id);
}
