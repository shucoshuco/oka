package es.fpg.oka.http;

import java.util.Arrays;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import es.fpg.oka.controller.common.GamesBaseController;
import es.fpg.oka.service.common.GameService;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ClearSessionListener implements HttpSessionListener, ApplicationContextAware {

	@Autowired
	private ApplicationContext applicationContext;
	
	@Override
	public void sessionCreated(HttpSessionEvent se) {
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent se) {
		log.info("Session destroyed: " + se.getSession().getId());
		String gameId = (String) se.getSession().getAttribute(GamesBaseController.GAME_ID_SESSION_ATTRIBUTE_NAME);
		if (gameId != null) {
			Arrays.stream(applicationContext.getBeanNamesForType(GameService.class))
				.map(applicationContext::getBean)
				.map(obj -> (GameService) obj)
				.forEach(service -> service.deleteGame(gameId));
			log.info("Game removed: " + gameId);
		}
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}
}
