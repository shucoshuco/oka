package es.fpg.oka.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.service.BoardConfigurationService;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/config")
@Secured("ROLE_USER")
public class BoardConfigurationController {

	@Autowired
	private BoardConfigurationService service;
	
	@RequestMapping("/user/{idConf}")
	@Secured("ROLE_USER")
	public BoardConfiguration getCurrentUserConfiguration(@PathVariable(name = "idConf") long idConf) {
		return service.getConfiguration(idConf);
	}

	@RequestMapping(value = "/user", method = RequestMethod.POST)
	@Secured("ROLE_USER")
	public BoardConfiguration createBoardConfiguration(@RequestBody BoardConfiguration conf) {
		return service.insert(conf);
	}

	@RequestMapping(value = "/user/{idConf}", method = RequestMethod.PUT)
	@Secured("ROLE_USER")
	public BoardConfiguration updateBoardConfiguration(
			@PathVariable(name = "idConf") long idConf,
			@RequestBody BoardConfiguration conf)
	{
		return service.update(conf);
	}
	
	@RequestMapping(value = "/user/{idConf}", method = RequestMethod.DELETE)
	@Secured("ROLE_USER")
	public boolean deleteBoardConfiguration(@PathVariable(name = "idConf") long idConf) {
		service.delete(idConf);
		return true;
	}

	@RequestMapping(value = "/user")
	@Secured("ROLE_USER")
	public List<BoardConfiguration> getUserConfigurations() {
		return service.getAllConfigurationsOfUser();
	}
}
