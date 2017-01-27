package es.fpg.oka.service;

import java.util.List;

import es.fpg.oka.model.BoardConfiguration;

public interface BoardConfigurationService {

	BoardConfiguration getConfiguration(String id);
	BoardConfiguration insert(BoardConfiguration configuration);
	BoardConfiguration update(BoardConfiguration configuration);
	void delete(String id);
	
	List<BoardConfiguration> getAllConfigurationsOfUser(String id);
}
