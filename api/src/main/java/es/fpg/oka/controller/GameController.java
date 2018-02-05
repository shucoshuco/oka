package es.fpg.oka.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.controller.bean.CustomGame;
import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Game;
import es.fpg.oka.model.GameStatus;
import es.fpg.oka.model.Movement;
import es.fpg.oka.service.GameService;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/games/user")
public class GameController {

	public final static String ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME = "anonymous-game";
	
	@Autowired
	private GameService service;
	
	@RequestMapping(value = "")
	@Secured("ROLE_USER")
	public ResponseEntity<List<Game>> pendingUserGames() {
		return new ResponseEntity<>(service.userGames(), HttpStatus.OK);
	}

	@RequestMapping(value = "/{idGame}/roll-dice", method = RequestMethod.POST)
	public ResponseEntity<Movement> rollDice(@PathVariable(name = "idGame") String idGame) {
		Movement movement = service.rollDice(idGame);
		if (movement != null) {
			return new ResponseEntity<>(movement, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping("/{idGame}")
	public ResponseEntity<Game> getGame(@PathVariable(name = "idGame") String idGame) {
		Game game = service.getGame(idGame);
		if (game!= null) {
			return new ResponseEntity<>(game, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping("/{idGame}/status")
	public ResponseEntity<GameStatus> getGameStatus(@PathVariable(name = "idGame") String idGame) {
		Game game = service.getGame(idGame);
		if (game!= null) {
			return new ResponseEntity<>(game.getStatus(), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping("/{idGame}/cell")
	public ResponseEntity<Cell> getGameCell(
			@PathVariable(name = "idGame") String idGame,
			@RequestParam(name = "cell") int cell)
	{
		Game game = service.getGame(idGame);
		if (game!= null && cell < game.getBoard().size()) {
			return new ResponseEntity<>(game.getBoard().get(cell), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}
	
	@RequestMapping(value = "/create/custom", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public Game createGame(@RequestBody CustomGame game) {
		return service.createGame(game.getBoard(), game.getPlayers(), game.getDice());
	}

	@RequestMapping(value = "/create/configurable", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public Game createGame(@RequestBody BoardConfiguration conf) {
		return service.createGame(conf);
	}

	@RequestMapping(value = "/create/userconf", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public Game createGame(@RequestParam(name = "idConf") long idConf) {
		return service.createGame(idConf);
	}

	@RequestMapping(value = "/create/anonymous", method = RequestMethod.POST)
	public Game createAnonymousGame(HttpServletRequest request) {
		Game game = service.createAnonymousGame();
		HttpSession session = request.getSession();
		String lastGame = (String) session.getAttribute(ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME);
		if (lastGame != null) {
			service.deleteGame(lastGame);
		}
		session.setAttribute(ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME, game.getId());
		return game;
	}

	@RequestMapping(value = "/{idGame}", method = RequestMethod.DELETE)
	public boolean deleteGame(@PathVariable(name = "idGame") String idGame) {
		service.deleteGame(idGame);
		return true;
	}
}
