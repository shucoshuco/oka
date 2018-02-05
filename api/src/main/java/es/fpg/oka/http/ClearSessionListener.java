package es.fpg.oka.http;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import es.fpg.oka.controller.GameController;
import es.fpg.oka.service.GameService;
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
		String gameId = (String) se.getSession().getAttribute(GameController.ANONYMOUS_GAME_SESSION_ATTRIBUTE_NAME);
		if (gameId != null) {
			applicationContext.getBean(GameService.class).deleteGame(gameId);
			log.info("Anonymous game removed: " + gameId);
		}
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.applicationContext = applicationContext;
	}
}
