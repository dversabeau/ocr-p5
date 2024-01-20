package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createSessionTest() {
        Session sessionToCreate = new Session();
        when(sessionRepository.save(any(Session.class))).thenReturn(sessionToCreate);

        Session createdSession = sessionService.create(sessionToCreate);

        assertNotNull(createdSession);
        assertEquals(sessionToCreate, createdSession);
        verify(sessionRepository, times(1)).save(any(Session.class));
    }

    @Test
    void deleteSessionTest() {
        Long sessionIdToDelete = 1L;

        sessionService.delete(sessionIdToDelete);

        verify(sessionRepository, times(1)).deleteById(sessionIdToDelete);
    }

    @Test
    void findAllSessionsTest() {
        List<Session> sessions = new ArrayList<>();
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertNotNull(result);
        assertEquals(sessions, result);
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void getByIdExistingSessionIdTest() {
        Long sessionId = 1L;
        Session expectedSession = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(expectedSession));

        Session result = sessionService.getById(sessionId);

        assertNotNull(result);
        assertEquals(expectedSession, result);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void getByIdNonExistingSessionIdTest() {
        Long nonExistingSessionId = 2L;
        when(sessionRepository.findById(nonExistingSessionId)).thenReturn(Optional.empty());

        Session result = sessionService.getById(nonExistingSessionId);

        assertNull(result);
        verify(sessionRepository, times(1)).findById(nonExistingSessionId);
    }

    @Test
    void participateValidSessionAndUserTest() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        User user = new User();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        session.setUsers(new ArrayList<>());

        sessionService.participate(sessionId, userId);

        assertTrue(session.getUsers().stream().anyMatch(u -> u.equals(user)));
        verify(sessionRepository, times(1)).save(session);
    }


    @Test
    void participateInvalidSessionOrUserTest() {
        Long invalidSessionId = 1L;
        Long validUserId = 1L;

        when(sessionRepository.findById(invalidSessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(invalidSessionId, validUserId));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void participateUserAlreadyParticipatesTest() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = new Session();
        User user = new User();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        session.setUsers(new ArrayList<>());

        User existingUser = new User();
        existingUser.setId(userId);
        session.getUsers().add(existingUser);

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepository, never()).save(any(Session.class));
    }

}
