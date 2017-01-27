package es.fpg.oka.service;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import es.fpg.oka.repository.GameRepository;

public class GameServiceImplTest {

	private GameServiceImpl service;
	private GameRepository repository;
	
	@Before
	public void initialize() {
		service = new GameServiceImpl();
		repository = Mockito.mock(GameRepository.class);
	}
	
	@Test
	public void testRollDice() {
		
	}
	
}
