package es.fpg.oka.repository;

import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import es.fpg.oka.model.BoardConfigurationWrapper;

@FeignClient("users")
public interface BoardConfigurationsClient {

	@RequestMapping(method = RequestMethod.GET, value = "/confs/{idConf}")
	public BoardConfigurationWrapper getConfiguration(@PathVariable(name = "idConf") String idConf);
}
