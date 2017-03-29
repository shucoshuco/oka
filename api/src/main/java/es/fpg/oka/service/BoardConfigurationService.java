package es.fpg.oka.service;

import java.util.List;

import es.fpg.oka.model.BoardConfiguration;

public interface BoardConfigurationService {

	BoardConfiguration getConfiguration(long id);
	BoardConfiguration insert(BoardConfiguration configuration);
	BoardConfiguration update(BoardConfiguration configuration);
	void delete(long id);
	
	List<BoardConfiguration> getAllConfigurationsOfUser(long id);
}
