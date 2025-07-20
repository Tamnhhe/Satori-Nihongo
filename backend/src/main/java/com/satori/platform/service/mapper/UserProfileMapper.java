package com.satori.platform.service.mapper;

import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.dto.TeacherProfileDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserProfile} and its DTO {@link UserProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserProfileMapper extends EntityMapper<UserProfileDTO, UserProfile> {
    @Mapping(target = "teacherProfile", source = "teacherProfile", qualifiedByName = "teacherProfileId")
    @Mapping(target = "studentProfile", source = "studentProfile", qualifiedByName = "studentProfileId")
    UserProfileDTO toDto(UserProfile s);

    @Named("teacherProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TeacherProfileDTO toDtoTeacherProfileId(TeacherProfile teacherProfile);

    @Named("studentProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    StudentProfileDTO toDtoStudentProfileId(StudentProfile studentProfile);
}
