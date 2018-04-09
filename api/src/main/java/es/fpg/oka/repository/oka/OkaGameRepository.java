package es.fpg.oka.repository.oka;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.oka.OkaGame;

public interface OkaGameRepository extends MongoRepository<OkaGame, String> {

	List<OkaGame> findByUserId(String userId);
}
