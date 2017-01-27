package es.fpg.oka.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.BoardConfiguration;

public interface BoardConfigurationRepository extends MongoRepository<BoardConfiguration, String> {

	public List<BoardConfiguration> findByUserId(String userId);
}
