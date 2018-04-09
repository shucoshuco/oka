package es.fpg.oka.controller.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.common.User;
import es.fpg.oka.model.common.UserRegistration;
import es.fpg.oka.service.common.UserService;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/users")
public class UsersController {

	@Autowired
	private UserService service;
	
	@RequestMapping("/{idUser}")
	@Secured("ROLE_ADMIN")
	public ResponseEntity<User> getUser(@PathVariable(name = "idUser") String idUser) {
		User user = service.getUser(idUser);
		if (user != null) {
			return new ResponseEntity<>(user, HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.NOT_FOUND); 
	}

	@RequestMapping("/current")
	@Secured("ROLE_USER")
	public ResponseEntity<User> getCurrentUser() {
		return new ResponseEntity<>(service.getCurrentUser(), HttpStatus.OK);
	}
	
	@RequestMapping(value = "", method = RequestMethod.POST)
	public ResponseEntity<String> createUser(@RequestBody UserRegistration user) {
		try {
			service.createUser(user);
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (IllegalArgumentException iae) {
			return new ResponseEntity<String>(iae.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@RequestMapping(value = "/{idUser}", method = RequestMethod.PUT)
	@Secured("ROLE_USER")
	public ResponseEntity<String> updateUser(@PathVariable(name = "idUser") String idUser,
											@RequestBody UserRegistration user)
	{
		try {
			User newUser = service.updateUser(idUser, user);
			return newUser == null
					? new ResponseEntity<>(HttpStatus.NOT_FOUND)
					: new ResponseEntity<>(HttpStatus.OK);
					
		} catch (IllegalArgumentException iae) {
			return new ResponseEntity<String>(iae.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}
	
	
	@RequestMapping(value = "/{idUser}", method = RequestMethod.DELETE)
	@Secured("ROLE_ADMIN")
	public boolean deleteUser(@PathVariable(name = "idUser") String idUser) {
		service.deleteUser(idUser);
		return true;
	}
}
