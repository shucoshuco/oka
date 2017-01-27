package es.fpg.oka.repository;

import java.util.List;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import es.fpg.oka.model.BoardConfiguration;
import es.fpg.oka.model.Cell;

@FeignClient("cells")
public interface CellsClient {

	@RequestMapping(method = RequestMethod.GET, value = "/board")
	List<Cell> cells(@RequestBody BoardConfiguration configuration);
}
