package es.fpg.oka.repository.common;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.common.User;

public interface UserRepository extends MongoRepository<User, String> {

	public User findByName(String name);
}
