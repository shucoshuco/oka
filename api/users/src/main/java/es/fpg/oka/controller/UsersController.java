package es.fpg.oka.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.User;
import es.fpg.oka.service.UserService;

@RestController
public class UsersController {

	@Autowired
	private UserService service;
	
	@RequestMapping("/{idUser}")
	public ResponseEntity<User> getUser(@PathVariable(name = "idUser") String idUser) {
		User user = service.getUser(idUser);
		if (user != null) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}
	
	@RequestMapping(value = "", method = RequestMethod.POST)
	public User createUser(@PathVariable User user) {
		return service.createUser(user);
	}

	@RequestMapping(value = "/{idUser}", method = RequestMethod.PUT)
	public ResponseEntity<User> updateUser(@PathVariable(name = "idUser") String idUser, @RequestBody User user) {
		user.setId(idUser);
		user = service.updateUser(user);
		if (user != null) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}
	
	@RequestMapping(value = "/{idUser}", method = RequestMethod.DELETE)
	public boolean deleteUser(@PathVariable(name = "idUser") String idUser) {
		service.deleteUser(idUser);
		return true;
	}
}
