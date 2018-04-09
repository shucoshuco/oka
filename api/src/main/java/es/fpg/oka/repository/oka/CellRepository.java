package es.fpg.oka.repository.oka;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.oka.Cell;

public interface CellRepository extends MongoRepository<Cell, Long> {

	List<Cell> findByLevel(int level);
}
