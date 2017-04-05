package es.fpg.oka.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.service.BoardConfigurationService;

@CrossOrigin({"http://localhost:3000", "*"})
@RestController
@RequestMapping("/users/confs")
public class BoardConfigurationController {

	@Autowired
	private BoardConfigurationService service;
	
	@RequestMapping("/{idConf}")
	public BoardConfiguration getUser(@PathVariable(name = "idConf") long idConf) {
		return service.getConfiguration(idConf);
	}
	
	@RequestMapping(value = "", method = RequestMethod.POST)
	public BoardConfiguration createBoardConfiguration(@RequestBody BoardConfiguration conf) {
		return service.insert(conf);
	}

	@RequestMapping(value = "/{idConf}", method = RequestMethod.PUT)
	public BoardConfiguration updateBoardConfiguration(@PathVariable(name = "idConf") long idConf, @RequestBody BoardConfiguration conf) {
		conf.setId(idConf);
		return service.update(conf);
	}
	
	@RequestMapping(value = "/{idConf}", method = RequestMethod.DELETE)
	public boolean deleteBoardConfiguration(@PathVariable(name = "idConf") long idConf) {
		service.delete(idConf);
		return true;
	}

	@RequestMapping(value = "/user/{idUser}")
	public List<BoardConfiguration> getUserConfigurations(@PathVariable(name = "idUser") long idUser) {
		return service.getAllConfigurationsOfUser(idUser);
	}
}
