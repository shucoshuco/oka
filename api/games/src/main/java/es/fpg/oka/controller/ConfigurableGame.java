package es.fpg.oka.controller;

import java.util.List;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Player;
import lombok.Data;

@Data
public class ConfigurableGame {

	private BoardConfiguration configuration;
	private List<Player> players;
}
