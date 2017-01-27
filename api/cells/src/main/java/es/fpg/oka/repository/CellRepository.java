package es.fpg.oka.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import es.fpg.oka.model.Cell;

public interface CellRepository extends MongoRepository<Cell, String> {

	List<Cell> findByLevel(int level);
}
