package es.fpg.oka.model;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BoardConfigurationWrapper extends BoardConfiguration {

	private List<Player> players;
}
