package com.satori.platform.config;

import static org.springframework.security.config.Customizer.withDefaults;

import com.satori.platform.security.*;
import com.satori.platform.service.OAuth2Service;
import com.satori.platform.web.filter.SpaWebFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer.FrameOptionsConfig;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import tech.jhipster.config.JHipsterProperties;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

        private final JHipsterProperties jHipsterProperties;
        private final OAuth2Service oAuth2Service;
        private final OAuth2StateValidator oAuth2StateValidator;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
        private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
        private final ClientRegistrationRepository clientRegistrationRepository;
        private final OAuth2AuthorizedClientRepository authorizedClientRepository;

        public SecurityConfiguration(
                        JHipsterProperties jHipsterProperties,
                        OAuth2Service oAuth2Service,
                        OAuth2StateValidator oAuth2StateValidator,
                        OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler,
                        OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler,
                        ClientRegistrationRepository clientRegistrationRepository,
                        OAuth2AuthorizedClientRepository authorizedClientRepository) {
                this.jHipsterProperties = jHipsterProperties;
                this.oAuth2Service = oAuth2Service;
                this.oAuth2StateValidator = oAuth2StateValidator;
                this.oAuth2AuthenticationSuccessHandler = oAuth2AuthenticationSuccessHandler;
                this.oAuth2AuthenticationFailureHandler = oAuth2AuthenticationFailureHandler;
                this.clientRegistrationRepository = clientRegistrationRepository;
                this.authorizedClientRepository = authorizedClientRepository;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public OAuth2AuthenticationFilter oAuth2AuthenticationFilter(AuthenticationManager authenticationManager) {
                OAuth2AuthenticationFilter filter = new OAuth2AuthenticationFilter(
                                oAuth2Service, oAuth2StateValidator, authenticationManager);
                filter.setAuthenticationSuccessHandler(oAuth2AuthenticationSuccessHandler);
                filter.setAuthenticationFailureHandler(oAuth2AuthenticationFailureHandler);
                return filter;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, MvcRequestMatcher.Builder mvc,
                        AuthenticationManager authenticationManager) throws Exception {
                http
                                .cors(withDefaults())
                                .csrf(csrf -> csrf.disable())
                                .addFilterAfter(new SpaWebFilter(), BasicAuthenticationFilter.class)
                                .addFilterBefore(oAuth2AuthenticationFilter(authenticationManager),
                                                BasicAuthenticationFilter.class)
                                .headers(headers -> headers
                                                .contentSecurityPolicy(csp -> csp
                                                                .policyDirectives(jHipsterProperties.getSecurity()
                                                                                .getContentSecurityPolicy()))
                                                .frameOptions(FrameOptionsConfig::sameOrigin)
                                                .referrerPolicy(referrer -> referrer
                                                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                                                .permissionsPolicyHeader(permissions -> permissions.policy(
                                                                "camera=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), sync-xhr=()")))
                                .authorizeHttpRequests(authz ->
                                // prettier-ignore
                                authz
                                                .requestMatchers(mvc.pattern("/index.html"), mvc.pattern("/*.js"),
                                                                mvc.pattern("/*.txt"),
                                                                mvc.pattern("/*.json"), mvc.pattern("/*.map"),
                                                                mvc.pattern("/*.css"))
                                                .permitAll()
                                                .requestMatchers(mvc.pattern("/*.ico"), mvc.pattern("/*.png"),
                                                                mvc.pattern("/*.svg"),
                                                                mvc.pattern("/*.webapp"))
                                                .permitAll()
                                                .requestMatchers(mvc.pattern("/app/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/i18n/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/content/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/swagger-ui/**")).permitAll()
                                                .requestMatchers(mvc.pattern(HttpMethod.POST, "/api/authenticate"))
                                                .permitAll()
                                                .requestMatchers(mvc.pattern(HttpMethod.GET, "/api/authenticate"))
                                                .permitAll()
                                                .requestMatchers(mvc.pattern("/api/register")).permitAll()
                                                .requestMatchers(mvc.pattern("/api/activate")).permitAll()
                                                .requestMatchers(mvc.pattern("/api/account/reset-password/init"))
                                                .permitAll()
                                                .requestMatchers(mvc.pattern("/api/account/reset-password/finish"))
                                                .permitAll()
                                                .requestMatchers(mvc.pattern("/api/oauth2/authorize/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/api/oauth2/callback/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/api/oauth2/link/**")).authenticated()
                                                .requestMatchers(mvc.pattern("/api/oauth2/unlink/**")).authenticated()
                                                .requestMatchers(mvc.pattern("/api/oauth2/linked-accounts"))
                                                .authenticated()
                                                .requestMatchers(mvc.pattern("/api/admin/**"))
                                                .hasAuthority(AuthoritiesConstants.ADMIN)
                                                .requestMatchers(mvc.pattern("/api/courses/manage/**"))
                                                .hasAnyAuthority(AuthoritiesConstants.ADMIN,
                                                                AuthoritiesConstants.TEACHER)
                                                .requestMatchers(mvc.pattern("/api/quizzes/manage/**"))
                                                .hasAnyAuthority(AuthoritiesConstants.ADMIN,
                                                                AuthoritiesConstants.TEACHER)
                                                .requestMatchers(mvc.pattern("/api/gift-codes/generate/**"))
                                                .hasAnyAuthority(AuthoritiesConstants.ADMIN,
                                                                AuthoritiesConstants.TEACHER)
                                                .requestMatchers(mvc.pattern("/api/files/upload/**"))
                                                .hasAnyAuthority(AuthoritiesConstants.ADMIN,
                                                                AuthoritiesConstants.TEACHER)
                                                .requestMatchers(mvc.pattern("/api/analytics/**"))
                                                .hasAnyAuthority(AuthoritiesConstants.ADMIN,
                                                                AuthoritiesConstants.TEACHER)
                                                .requestMatchers(mvc.pattern("/api/ai/practice-tests/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/api/**")).authenticated()
                                                .requestMatchers(mvc.pattern("/v3/api-docs/**"))
                                                .hasAuthority(AuthoritiesConstants.ADMIN)
                                                .requestMatchers(mvc.pattern("/management/health")).permitAll()
                                                .requestMatchers(mvc.pattern("/management/health/**")).permitAll()
                                                .requestMatchers(mvc.pattern("/management/info")).permitAll()
                                                .requestMatchers(mvc.pattern("/management/prometheus")).permitAll()
                                                .requestMatchers(mvc.pattern("/management/**"))
                                                .hasAuthority(AuthoritiesConstants.ADMIN))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                                                .accessDeniedHandler(new BearerTokenAccessDeniedHandler()))
                                .oauth2ResourceServer(oauth2 -> oauth2.jwt(withDefaults()))
                                .oauth2Login(oauth2 -> oauth2
                                                .clientRegistrationRepository(clientRegistrationRepository)
                                                .authorizedClientRepository(authorizedClientRepository)
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler(oAuth2AuthenticationFailureHandler));
                return http.build();
        }

        @Bean
        MvcRequestMatcher.Builder mvc(HandlerMappingIntrospector introspector) {
                return new MvcRequestMatcher.Builder(introspector);
        }
}
