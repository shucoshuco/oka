package es.fpg.oka.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;
import es.fpg.oka.service.CellService;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/cells")
public class CellsController {

	@Autowired
	private CellService service;
	
	@RequestMapping("/board")
	public List<Cell> cells(@RequestBody BoardConfiguration configuration) {
		return service.getCells(configuration);
	}
	
	@RequestMapping("/{idCell}")
	public ResponseEntity<Cell> cell(@PathVariable long idCell) {
		Cell cell = service.getCell(idCell);
		return cell == null
				? new ResponseEntity<>(HttpStatus.NOT_FOUND)
				: new ResponseEntity<>(cell, HttpStatus.OK);
	}
	
	@RequestMapping("/oka")
	public ResponseEntity<Cell> oka() {
		Cell cell = service.getOka();
		return cell == null
				? new ResponseEntity<>(HttpStatus.NOT_FOUND)
				: new ResponseEntity<>(cell, HttpStatus.OK);
	}
	
}
