package es.fpg.oka.service.oka.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.repository.oka.BoardConfigurationRepository;
import es.fpg.oka.service.common.impl.SecuredServiceBase;
import es.fpg.oka.service.oka.BoardConfigurationService;

@Service
public class BoardConfigurationServiceImpl extends SecuredServiceBase implements BoardConfigurationService {

	@Autowired
	private BoardConfigurationRepository configRepository;

	@Override
	public BoardConfiguration getAnonymousConfiguration() {
		return configRepository.findOne(1l);
	}
	
	@Override
	public BoardConfiguration getConfiguration(long id) {
		BoardConfiguration bc = configRepository.findOne(id);
		return validUser(bc.getUserId()) ? bc : null; 
	}

	@Override
	public BoardConfiguration insert(BoardConfiguration configuration) {
		configuration.setUserId(getCurrentAuthenticatedPrincipal().getId());
		return configRepository.insert(configuration);
	}

	@Override
	public BoardConfiguration update(BoardConfiguration configuration) {
		BoardConfiguration bc = getConfiguration(configuration.getId());
		if (bc != null && validUser(bc.getUserId())) {
			configuration.setUserId(getCurrentAuthenticatedPrincipal().getId());
			return configRepository.save(configuration);
		}
		return null;
	}

	@Override
	public void delete(long id) {
		BoardConfiguration entity = new BoardConfiguration();
		entity.setUserId(getCurrentAuthenticatedPrincipal().getId());
		entity.setId(id);
		configRepository.delete(entity);
	}

	@Override
	public List<BoardConfiguration> getAllConfigurationsOfUser() {
		return configRepository.findByUserId(getCurrentAuthenticatedPrincipal().getId());
	}
}
