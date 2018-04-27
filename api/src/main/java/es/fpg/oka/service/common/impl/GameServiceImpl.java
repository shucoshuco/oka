package es.fpg.oka.service.common.impl;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.fpg.oka.model.common.Game;
import es.fpg.oka.model.common.User;
import es.fpg.oka.repository.common.GameRepository;
import es.fpg.oka.service.common.GamesSummaryService;
import es.fpg.oka.service.common.UserService;

@Service
public class GameServiceImpl extends SecuredServiceBase implements GamesSummaryService {

	private final static Comparator<Game> GAME_HIT_COMPARATOR =
			(g1, g2) -> g1.getHits() > g2.getHits() ? -1 : 1;
	
	private final static Comparator<Map.Entry<String, Long>> USER_GAME_HIT_COMPARATOR =
			(e1, e2) -> e1.getValue().compareTo(e2.getValue());
			
	@Autowired
	private GameRepository repository;
	
	@Autowired
	private UserService userService;
	
	@Override
	public List<Game> getAvailableGames() {
		return repository.findAll();
	}

	@Override
	public void addHitForGame(String gameId) {
		Game game = repository.findOne(gameId);
		if (game != null) {
			game.setHits(game.getHits() + 1);
			repository.save(game);
			if (isAuthenticated()) {
				User user = userService.getCurrentUser();
				long value = user.getGameHits().containsKey(gameId)
					? user.getGameHits().get(gameId) + 1 : 1;
				user.getGameHits().put(gameId, value);
				userService.updateUser(user);
			}
		}
	}
	
	@Override
	public List<Game> getMostPlayedGames() {
		return getAvailableGames().stream()
				.sorted(GAME_HIT_COMPARATOR)
				.limit(3)
				.collect(Collectors.toList());
	}
	
	public List<Game> getCurrentUserMostPlayedGames() {
		return userService.getCurrentUser().getGameHits().entrySet().stream()
			.sorted(USER_GAME_HIT_COMPARATOR)
			.limit(3)
			.map(e -> repository.findOne(e.getKey()))
			.collect(Collectors.toList());
	}

}
