package es.fpg.oka.config;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import es.fpg.oka.security.MongoDBAuthenticationProvider;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Value("${security.cors.allowedOrigins}")
	private String corsHost;
	
	@Value("${security.cors.allowedHeaders}")
	private String corsHeaders;
	
	@Autowired
	@Qualifier("restAuthenticationEntryPoint")
	private AuthenticationEntryPoint restAuthenticationEntryPoint;

	@Autowired
	private MongoDBAuthenticationProvider authenticationProvider;

	@Autowired
	private SimpleUrlAuthenticationSuccessHandler authenticationSuccessHandler;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean("restAuthenticationEntryPoint")
	public AuthenticationEntryPoint authenticationEntryPoint() {
		return new AuthenticationEntryPoint() {
			@Override
			public void commence(
					HttpServletRequest request, HttpServletResponse response,
					AuthenticationException authException)
							throws IOException
			{
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
			}
		};
	}
	
	@Bean
	public AuthenticationTrustResolver authenticationTrustResolvers() {
		return new AuthenticationTrustResolverImpl();
	}

	@Bean
	public SimpleUrlAuthenticationSuccessHandler authenticationSuccessHandler() {
		return new SimpleUrlAuthenticationSuccessHandler() {

			private RequestCache requestCache = new HttpSessionRequestCache();

			@Override
			public void onAuthenticationSuccess(
					HttpServletRequest request, HttpServletResponse response,
					Authentication authentication)
							throws ServletException, IOException
			{
				SavedRequest savedRequest = requestCache.getRequest(request, response);

				if (savedRequest == null) {
					clearAuthenticationAttributes(request);
					return;
				}
				String targetUrlParam = getTargetUrlParameter();
				if (isAlwaysUseDefaultTargetUrl()
						|| (targetUrlParam != null && StringUtils.hasText(request.getParameter(targetUrlParam)))) {
					requestCache.removeRequest(request, response);
					clearAuthenticationAttributes(request);
					return;
				}

				clearAuthenticationAttributes(request);
			}
		};
	}
    
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(authenticationProvider);
    }
	
    @Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(corsHost));
		configuration.setAllowedHeaders(Arrays.asList(corsHeaders));
		configuration.setAllowedMethods(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
		http
			.formLogin()
				.loginProcessingUrl("/login")
				.defaultSuccessUrl("/users/current")
				.successHandler(authenticationSuccessHandler)
				.failureHandler(new SimpleUrlAuthenticationFailureHandler())
			.and()
				.exceptionHandling()
				.authenticationEntryPoint(restAuthenticationEntryPoint)
			.and()
				.logout()
				.logoutUrl("/logout")
				.logoutSuccessUrl("/")
			.and()
				.authorizeRequests()
					.antMatchers(
							"/", "/login", "/logout", 
							"/games/user/**", "/cells/**")
						.permitAll()
					.anyRequest().authenticated()
					.anyRequest().permitAll()
			.and()
				.cors()
			.and()
				.csrf().disable();        
	    }
}