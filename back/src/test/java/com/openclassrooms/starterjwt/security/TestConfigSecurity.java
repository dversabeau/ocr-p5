package com.openclassrooms.starterjwt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
@TestConfiguration
public class TestConfigSecurity {

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("alicia.marty@gmail.com")
                .password("{noop}test!1234")
                .roles("ADMIN");
    }

}
