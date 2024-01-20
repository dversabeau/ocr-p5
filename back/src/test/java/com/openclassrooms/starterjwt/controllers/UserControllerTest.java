package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.security.TestConfigSecurity;
import org.json.JSONObject;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
@Import(TestConfigSecurity.class)
@SqlGroup({
        @Sql(value = "classpath:sql/user/empty/reset.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:sql/user/init/user-data.sql", executionPhase = BEFORE_TEST_METHOD)
})
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_retrieve_one_user() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        String email = "laura.royer@yahoo.fr";
        String firstName = "Julien";
        String lastName = "Mael";

        this.mockMvc.perform(get("/api/user/{id}", 3)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.firstName").value(firstName))
                .andExpect(jsonPath("$.lastName").value(lastName))
                .andExpect(jsonPath("$.admin").isBoolean());
    }
    @Test
    void should_not_retrieve_one_user() throws Exception {
        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(get("/api/user/{id}", 10)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_not_delete_one_user() throws Exception {
        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(delete("/api/user/{id}", 10)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void should_not_authorized_to_delete_another_user() throws Exception {
        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(delete("/api/user/{id}", 3)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void should_delete_one_user() throws Exception {
        String token = generateTestToken("laura.royer@yahoo.fr", "test!1234");

        this.mockMvc.perform(delete("/api/user/{id}", 3)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    private String generateTestToken(String email, String password) throws Exception {

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        String jsonRequest = objectMapper.writeValueAsString(loginRequest);


        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonRequest))
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        JSONObject responseJson = new JSONObject(responseBody);
        return responseJson.getString("token");
    }
}
