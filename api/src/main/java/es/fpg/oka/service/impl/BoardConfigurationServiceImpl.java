package es.fpg.oka.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.repository.BoardConfigurationRepository;
import es.fpg.oka.service.BoardConfigurationService;

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
		configuration.setUserId(getCurrentPrincipalId());
		return configRepository.insert(configuration);
	}

	@Override
	public BoardConfiguration update(BoardConfiguration configuration) {
		BoardConfiguration bc = getConfiguration(configuration.getId());
		if (bc != null && validUser(bc.getUserId())) {
			configuration.setUserId(getCurrentPrincipalId());
			return configRepository.save(configuration);
		}
		return null;
	}

	@Override
	public void delete(long id) {
		BoardConfiguration entity = new BoardConfiguration();
		entity.setUserId(getCurrentPrincipalId());
		entity.setId(id);
		configRepository.delete(entity);
	}

	@Override
	public List<BoardConfiguration> getAllConfigurationsOfUser() {
		return configRepository.findByUserId(getCurrentPrincipalId());
	}
}
