package es.fpg.oka.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.repository.BoardConfigurationRepository;

@Service
public class BoardConfigurationServiceImpl implements BoardConfigurationService {

	@Autowired
	private BoardConfigurationRepository configRepository;
	
	@Override
	public BoardConfiguration getConfiguration(String id) {
		return configRepository.findOne(id); 
	}

	@Override
	public BoardConfiguration insert(BoardConfiguration configuration) {
		return configRepository.insert(configuration);
	}

	@Override
	public BoardConfiguration update(BoardConfiguration configuration) {
		return configRepository.save(configuration);
	}

	@Override
	public void delete(String id) {
		configRepository.delete(id);
	}

	@Override
	public List<BoardConfiguration> getAllConfigurationsOfUser(String id) {
		return configRepository.findByUserId(id);
	}

}
