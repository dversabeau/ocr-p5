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

import java.util.ArrayList;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
@Import(TestConfigSecurity.class)
@SqlGroup({
        @Sql(value = "classpath:sql/teacher/empty/reset.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:sql/teacher/init/teacher-data.sql", executionPhase = BEFORE_TEST_METHOD),
})
public class TeacherControllersTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_retrieve_one_teacher() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        String lastname = "DELAHAYE";
        String firstname = "Margot";

        this.mockMvc.perform(get("/api/teacher/{id}", 1)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.lastName").value(lastname))
                .andExpect(jsonPath("$.firstName").value(firstname));
    }

    @Test
    void should_retrieve_all_teachers() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(get("/api/teacher", 1)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2));
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
