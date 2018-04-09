package es.fpg.oka.service.oka;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import es.fpg.oka.model.oka.BoardConfiguration;
import es.fpg.oka.model.oka.Player;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "games.default")
@Component
public class DefaultData {

	private BoardConfiguration board;
	private List<Player> players;
}
