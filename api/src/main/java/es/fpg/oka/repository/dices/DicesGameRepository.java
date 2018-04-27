package es.fpg.oka.repository.dices;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.dices.DicesGame;

public interface DicesGameRepository extends MongoRepository<DicesGame, String> {

}
