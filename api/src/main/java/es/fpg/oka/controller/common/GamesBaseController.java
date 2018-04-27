package es.fpg.oka.controller.common;

import java.util.UUID;

import javax.servlet.http.HttpServletRequest;


public class GamesBaseController {

	public final static String GAME_ID_SESSION_ATTRIBUTE_NAME = "current-game-id";
	
	protected String getCurrentGameId(HttpServletRequest request) {
		if (request.getSession().getAttribute(GAME_ID_SESSION_ATTRIBUTE_NAME) == null) {
			request.getSession().setAttribute(GAME_ID_SESSION_ATTRIBUTE_NAME, UUID.randomUUID().toString());
		}
		return (String) request.getSession().getAttribute(GAME_ID_SESSION_ATTRIBUTE_NAME);
	}
}
