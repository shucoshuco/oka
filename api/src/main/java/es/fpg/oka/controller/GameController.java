package es.fpg.oka.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.Cell;
import es.fpg.oka.model.Game;
import es.fpg.oka.model.GameStatus;
import es.fpg.oka.model.Movement;
import es.fpg.oka.service.GameService;

@CrossOrigin(origins= {"http://localhost:3000", "http://192.168.1.104:3000"})
@RestController
@RequestMapping("/games")
public class GameController {

	@Autowired
	private GameService service;
	
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
	
	@RequestMapping(value = "/game/custom", method = RequestMethod.POST)
	public Game createGame(@RequestBody CustomGame game) {
		return service.createGame(game.getBoard(), game.getPlayers(), game.getDice());
	}

	@RequestMapping(value = "/game/configurable", method = RequestMethod.POST)
	public Game createGame(@RequestBody ConfigurableGame game) {
		return service.createGame(game.getConfiguration(), game.getPlayers());
	}

	@CrossOrigin("*")
	@RequestMapping(value = "/game/userconf", method = RequestMethod.POST)
	public Game createGame(@RequestParam(name = "idConf") long idConf) {
		return service.createGame(idConf);
	}
	
	@RequestMapping(value = "/{idGame}", method = RequestMethod.DELETE)
	public boolean deleteGame(@PathVariable(name = "idGame") String idGame) {
		service.deleteGame(idGame);
		return true;
	}
}
