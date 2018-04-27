package es.fpg.oka.controller.common;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.common.Game;
import es.fpg.oka.service.common.GamesSummaryService;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/games")
public class GameSummaryController {

	@Autowired
	private GamesSummaryService service;
	
	@RequestMapping("/available")
	@Secured("ROLE_USER")
	public ResponseEntity<List<Game>> getAvailableGames() {
		return ResponseEntity.ok().body(service.getAvailableGames());
	}

	@RequestMapping("/frequent")
	@Secured("ROLE_USER")
	public ResponseEntity<List<Game>> getFrequentGames() {
		return ResponseEntity.ok().body(service.getMostPlayedGames());
	}

	@RequestMapping("/user/preferred")
	@Secured("ROLE_USER")
	public ResponseEntity<List<Game>> getUserFrequentGames() {
		return ResponseEntity.ok().body(service.getCurrentUserMostPlayedGames());
	}

}
