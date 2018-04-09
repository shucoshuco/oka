package es.fpg.oka.service.oka;

import java.util.List;

import es.fpg.oka.model.oka.BoardConfiguration;

public interface BoardConfigurationService {

	BoardConfiguration getAnonymousConfiguration();
	BoardConfiguration getConfiguration(long id);
	BoardConfiguration insert(BoardConfiguration configuration);
	BoardConfiguration update(BoardConfiguration configuration);
	void delete(long id);
	
	List<BoardConfiguration> getAllConfigurationsOfUser();
}
