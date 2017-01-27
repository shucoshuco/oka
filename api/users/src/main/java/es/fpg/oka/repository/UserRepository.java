package es.fpg.oka.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.User;

public interface UserRepository extends MongoRepository<User, String> {

}
