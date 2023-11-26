package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class UserMapperTest {

    private final UserMapper userMapper = new UserMapperImpl();
    private final UserDto userDto = new UserDto();

    public UserMapperTest () {
        userDto.setId(1L);
        userDto.setAdmin(true);
        userDto.setPassword("test!1234");
        userDto.setEmail("test@test.fr");
        userDto.setFirstName("Michel");
        userDto.setLastName("Dupont");
    }
    @Test
    void toEntityTest(){

        User user = userMapper.toEntity(userDto);

        assertThat(user.getId()).isEqualTo(1L);
        assertThat(user.getEmail()).isEqualTo("test@test.fr");
        assertThat(user.getFirstName()).isEqualTo("Michel");
        assertThat(user.getLastName()).isEqualTo("Dupont");
        assertThat(user.getPassword()).isEqualTo("test!1234");

    }

    @Test
    void toEntityListTest () {
        List<UserDto> listDto = List.of(userDto);

        List<User> users = userMapper.toEntity(listDto);

        assertThat(users.size()).isEqualTo(1);
    }
    @Test
    void toDtoListTest () {
        User user = new User();

        user.setId(1L);
        user.setAdmin(true);
        user.setPassword("test!1234");
        user.setEmail("test@test.fr");
        user.setFirstName("Michel");
        user.setLastName("Dupont");

        List<User> users = List.of(user);

        List<UserDto> dtos = userMapper.toDto(users);

        assertThat(dtos.size()).isEqualTo(1);
    }

}
