package com.satori.platform.service.mapper;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.service.dto.CourseClassDTO;
import com.satori.platform.service.dto.CourseDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.dto.TeacherProfileDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CourseClass} and its DTO {@link CourseClassDTO}.
 */
@Mapper(componentModel = "spring")
public interface CourseClassMapper extends EntityMapper<CourseClassDTO, CourseClass> {
    @Mapping(target = "course", source = "course", qualifiedByName = "courseId")
    @Mapping(target = "teacher", source = "teacher", qualifiedByName = "teacherProfileId")
    @Mapping(target = "students", source = "students", qualifiedByName = "studentProfileIdSet")
    CourseClassDTO toDto(CourseClass s);

    @Mapping(target = "removeStudents", ignore = true)
    CourseClass toEntity(CourseClassDTO courseClassDTO);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseDTO toDtoCourseId(Course course);

    @Named("teacherProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TeacherProfileDTO toDtoTeacherProfileId(TeacherProfile teacherProfile);

    @Named("studentProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentProfileDTO toDtoStudentProfileId(StudentProfile studentProfile);

    @Named("studentProfileIdSet")
    default Set<StudentProfileDTO> toDtoStudentProfileIdSet(Set<StudentProfile> studentProfile) {
        return studentProfile.stream().map(this::toDtoStudentProfileId).collect(Collectors.toSet());
    }
}
