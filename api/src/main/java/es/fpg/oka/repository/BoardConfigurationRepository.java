package es.fpg.oka.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.BoardConfiguration;

public interface BoardConfigurationRepository extends MongoRepository<BoardConfiguration, Long> {

	public List<BoardConfiguration> findByUserId(long userId);
}
