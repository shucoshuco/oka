package es.fpg.oka.controller.oka;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.controller.common.GamesBaseController;
import es.fpg.oka.controller.oka.bean.CustomGame;
import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.GameStatus;
import es.fpg.oka.model.oka.Movement;
import es.fpg.oka.model.oka.OkaGame;
import es.fpg.oka.service.oka.OkaGameService;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/games/oka")
public class OkaGameController extends GamesBaseController {

	@Autowired
	private OkaGameService service;
	
	@RequestMapping(value = "/currentGame/roll-dice", method = RequestMethod.POST)
	public ResponseEntity<Movement> rollDice(HttpServletRequest request) {
		Movement movement = service.rollDice(getCurrentGameId(request));
		if (movement != null) {
			return new ResponseEntity<>(movement, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping("/currentGame")
	public ResponseEntity<OkaGame> getGame(HttpServletRequest request) {
		OkaGame game = service.getGame(getCurrentGameId(request));
		if (game!= null) {
			return new ResponseEntity<>(game, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping("/currentGame/status")
	public ResponseEntity<GameStatus> getGameStatus(HttpServletRequest request) {
		OkaGame game = service.getGame(getCurrentGameId(request));
		if (game!= null) {
			return new ResponseEntity<>(game.getStatus(), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping("/currentGame/cell")
	public ResponseEntity<Cell> getGameCell(
			HttpServletRequest request,
			@RequestParam(name = "cell") int cell)
	{
		OkaGame game = service.getGame(getCurrentGameId(request));
		if (game!= null && cell < game.getBoard().size()) {
			return new ResponseEntity<>(game.getBoard().get(cell), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping(value = "/create/anonymous", method = RequestMethod.POST)
	public OkaGame createAnonymous(HttpServletRequest request) {
		String gameId = getCurrentGameId(request);
		service.createAnonymousGame(gameId);
		OkaGame game = new OkaGame();
		game.setId(gameId);
		return game;
	}

	@RequestMapping(value = "/create/default", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public OkaGame createDefalt(HttpServletRequest request) {
		String gameId = getCurrentGameId(request);
		service.createGame(gameId);
		OkaGame game = new OkaGame();
		game.setId(gameId);
		return game;
	}

	@RequestMapping(value = "/create/custom", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public OkaGame createGame(@RequestBody CustomGame game, HttpServletRequest request) {
		String gameId = getCurrentGameId(request);
		service.createGame(gameId, game.getBoard(), game.getPlayers(), game.getDice());
		OkaGame newGame = new OkaGame();
		newGame.setId(gameId);
		return newGame;
	}

	@RequestMapping(value = "/create/configurable", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public ResponseEntity<String> createGame(@RequestBody BoardConfiguration conf, HttpServletRequest request) {
		String gameId = getCurrentGameId(request);
		service.createGame(gameId, conf);
		return ResponseEntity.ok().body(gameId);
	}

	@RequestMapping(value = "/create/userconf", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public ResponseEntity<String> createGame(
			@RequestParam(name = "idConf") long idConf,
			HttpServletRequest request)
	{
		String gameId = getCurrentGameId(request);
		service.createGame(gameId, idConf);
		return ResponseEntity.ok().body(gameId);
	}

	@RequestMapping(value = "/currentGame", method = RequestMethod.DELETE)
	public boolean deleteGame(HttpServletRequest request) {
		service.deleteGame(getCurrentGameId(request));
		return true;
	}
}
