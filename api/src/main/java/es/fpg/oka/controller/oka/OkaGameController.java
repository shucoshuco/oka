package es.fpg.oka.controller.oka;

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

import es.fpg.oka.controller.oka.bean.CustomGame;
import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Cell;
import es.fpg.oka.model.oka.OkaGame;
import es.fpg.oka.service.oka.OkaGameService;
import es.fpg.oka.model.oka.GameStatus;
import es.fpg.oka.model.oka.Movement;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/games/oka")
public class OkaGameController {

	public final static String ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME = "anonymous-game";
	
	@Autowired
	private OkaGameService service;
	
	@RequestMapping(value = "")
	@Secured("ROLE_USER")
	public ResponseEntity<List<OkaGame>> pendingUserGames() {
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
	public ResponseEntity<OkaGame> getGame(@PathVariable(name = "idGame") String idGame) {
		OkaGame game = service.getGame(idGame);
		if (game!= null) {
			return new ResponseEntity<>(game, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping("/{idGame}/status")
	public ResponseEntity<GameStatus> getGameStatus(@PathVariable(name = "idGame") String idGame) {
		OkaGame game = service.getGame(idGame);
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
		OkaGame game = service.getGame(idGame);
		if (game!= null && cell < game.getBoard().size()) {
			return new ResponseEntity<>(game.getBoard().get(cell), HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}
	
	@RequestMapping(value = "/create/custom", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public ResponseEntity<OkaGame> createGame(@RequestBody CustomGame game) {
		OkaGame g = new OkaGame();
		g.setId(service.createGame(game.getBoard(), game.getPlayers(), game.getDice()));
		return ResponseEntity.ok().body(g);
	}

	@RequestMapping(value = "/create/configurable", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public ResponseEntity<OkaGame> createGame(@RequestBody BoardConfiguration conf) {
		OkaGame g = new OkaGame();
		g.setId(service.createGame(conf));
		return ResponseEntity.ok().body(g);
	}

	@RequestMapping(value = "/create/userconf", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public ResponseEntity<OkaGame> createGame(@RequestParam(name = "idConf") long idConf) {
		OkaGame g = new OkaGame();
		g.setId(service.createGame(idConf));
		return ResponseEntity.ok().body(g);
	}

	@RequestMapping(value = "/create/anonymous", method = RequestMethod.POST)
	public ResponseEntity<OkaGame> createAnonymousGame(HttpServletRequest request) {
		OkaGame g = new OkaGame();
		g.setId(service.createAnonymousGame());
		HttpSession session = request.getSession();
		String lastGame = (String) session.getAttribute(ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME);
		if (lastGame != null) {
			service.deleteGame(lastGame);
		}
		session.setAttribute(ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME, g.getId());
		return ResponseEntity.ok().body(g);
	}

	@RequestMapping(value = "/{idGame}", method = RequestMethod.DELETE)
	public boolean deleteGame(@PathVariable(name = "idGame") String idGame) {
		service.deleteGame(idGame);
		return true;
	}
}
