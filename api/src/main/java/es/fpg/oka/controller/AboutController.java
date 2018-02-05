package es.fpg.oka.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.fpg.oka.controller.bean.About;

@CrossOrigin(origins = "${security.cors.allowedOrigins}")
@RestController
@RequestMapping("/")
public class AboutController {

	@RequestMapping("")
	public ResponseEntity<About> about() {
		return new ResponseEntity<About>(new About("OKA-Game"), HttpStatus.OK);
	}
}
