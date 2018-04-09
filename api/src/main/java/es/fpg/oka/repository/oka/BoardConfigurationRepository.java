package es.fpg.oka.repository.oka;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.oka.BoardConfiguration;

public interface BoardConfigurationRepository extends MongoRepository<BoardConfiguration, Long> {

	public List<BoardConfiguration> findByUserId(String userId);
}
