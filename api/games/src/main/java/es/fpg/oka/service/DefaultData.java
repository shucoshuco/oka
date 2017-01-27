package es.fpg.oka.service;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Player;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "default")
@Component
public class DefaultData {

	private BoardConfiguration board;
	private List<Player> players;
}
