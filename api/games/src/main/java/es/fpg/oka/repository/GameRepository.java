package es.fpg.oka.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.Game;

public interface GameRepository extends MongoRepository<Game, String> {

}