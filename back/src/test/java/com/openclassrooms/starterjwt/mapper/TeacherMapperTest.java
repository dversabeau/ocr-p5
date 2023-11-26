package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class TeacherMapperTest {

    private final TeacherMapper teacherMapper = new TeacherMapperImpl();

    private final TeacherDto teacherDto = new TeacherDto();
    public TeacherMapperTest () {
        teacherDto.setId(1L);
        teacherDto.setFirstName("François");
        teacherDto.setLastName("Dupont");
    }

    @Test
    void toEntityTest(){

        Teacher teacher = teacherMapper.toEntity(teacherDto);

        assertThat(teacher.getId()).isEqualTo(1L);
        assertThat(teacher.getFirstName()).isEqualTo("François");
        assertThat(teacher.getLastName()).isEqualTo("Dupont");
    }

}
