package es.fpg.oka.controller.dices;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.controller.common.GamesBaseController;
import es.fpg.oka.model.dices.DicesGame;
import es.fpg.oka.model.dices.Movement;
import es.fpg.oka.service.dices.DicesGameService;


@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/games/dices")
public class DicesGameController extends GamesBaseController {

	@Autowired
	private DicesGameService service;
	
	@RequestMapping("/currentGame")
	public ResponseEntity<DicesGame> getGame(HttpServletRequest request) {
		DicesGame game = service.getGame(getCurrentGameId(request));
		if (game!= null) {
			return new ResponseEntity<>(game, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping(value = "/currentGame/roll-dice", method = RequestMethod.POST)
	public ResponseEntity<Movement> rollDice(HttpServletRequest request) {
		Movement movement = service.rollDice(getCurrentGameId(request));
		if (movement != null) {
			return new ResponseEntity<>(movement, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(value = "/create/anonymous", method = RequestMethod.POST)
	public DicesGame createAnonymousGame(HttpServletRequest request) {
		String gameId = getCurrentGameId(request);
		service.createGame(gameId);
		DicesGame game = new DicesGame();
		game.setId(gameId);
		return game;
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public DicesGame createGameForCurrentUser(HttpServletRequest request) {
		String gameId = getCurrentGameId(request);
		service.createGame(gameId);
		DicesGame game = new DicesGame();
		game.setId(gameId);
		return game;
	}
}
