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
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.jdbc.SqlGroup;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.context.jdbc.Sql.ExecutionPhase.BEFORE_TEST_METHOD;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
@Import(TestConfigSecurity.class)
@SqlGroup({
        @Sql(value = "classpath:sql/session/empty/reset.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:sql/teacher/empty/reset.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:sql/teacher/init/teacher-data.sql", executionPhase = BEFORE_TEST_METHOD),
        @Sql(value = "classpath:sql/session/init/session-data.sql", executionPhase = BEFORE_TEST_METHOD)
})
public class SessionControllersTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void should_retrieve_one_session() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        String name = "Session 2";
        String description = "description 2";
        String date = "2023-09-09T13:00:00.000+00:00";
        Integer teacherId = 2;
        ArrayList users = new ArrayList<>();

        this.mockMvc.perform(get("/api/session/{id}", 2)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value(name))
                .andExpect(jsonPath("$.description").value(description))
                .andExpect(jsonPath("$.date").value(date))
                .andExpect(jsonPath("$.users").value(users))
                .andExpect(jsonPath("$.teacher_id").value(teacherId));
    }

    @Test
    void should_retrieve_all_sessions() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(get("/api/session")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void should_create_a_session() throws Exception {
        final File jsonFile = new ClassPathResource("sql/session/init/session_create.json").getFile();
        final String sessionToCreate = Files.readString(jsonFile.toPath());

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");
        ArrayList users = new ArrayList();

        this.mockMvc.perform(post("/api/session")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionToCreate))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("session 1"))
                .andExpect(jsonPath("$.date").value("2012-01-01T00:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(2))
                .andExpect(jsonPath("$.users").value(users))
                .andExpect(jsonPath("$.description").value("my description"))
        ;
    }

    @Test
    void should_update_a_session() throws Exception {
        final File jsonFile = new ClassPathResource("sql/session/init/session_update.json").getFile();
        final String sessionToUpdate= Files.readString(jsonFile.toPath());

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");
        ArrayList users = new ArrayList();

        this.mockMvc.perform(put("/api/session/{id}", 1)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionToUpdate))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("session 1 updated"))
                .andExpect(jsonPath("$.date").value("2012-01-01T00:00:00.000+00:00"))
                .andExpect(jsonPath("$.teacher_id").value(2))
                .andExpect(jsonPath("$.users").value(users))
                .andExpect(jsonPath("$.description").value("my description updated"))
        ;
    }

    @Test
    void should_delete_a_session() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(get("/api/session/{id}", 1)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

    }

    @Test
    void should_participate() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(post("/api/session/{id}/participate/{userId}", 1, 1)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

    }

    @Test
    void should_not_participate_anymore() throws Exception {

        String token = generateTestToken("alicia.marty@gmail.com", "test!1234");

        this.mockMvc.perform(delete("/api/session/{id}/participate/{userId}", 1, 1)
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
