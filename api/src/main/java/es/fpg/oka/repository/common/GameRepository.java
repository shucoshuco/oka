package es.fpg.oka.repository.common;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.common.Game;

public interface GameRepository extends MongoRepository<Game, String> {

}
