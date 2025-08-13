package com.satori.platform.service.mapper;

import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.service.dto.StudentProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StudentProfile} and its DTO
 * {@link StudentProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentProfileMapper extends EntityMapper<StudentProfileDTO, StudentProfile> {

    @Mapping(target = "userProfileId", source = "userProfile.id")
    @Mapping(target = "userProfileFullName", source = "userProfile.fullName")
    StudentProfileDTO toDto(StudentProfile studentProfile);

    @Mapping(target = "userProfile", source = "userProfileId", qualifiedByName = "userProfileId")
    @Mapping(target = "classes", ignore = true)
    @Mapping(target = "removeClasses", ignore = true)
    @Mapping(target = "flashcardSessions", ignore = true)
    @Mapping(target = "removeFlashcardSessions", ignore = true)
    @Mapping(target = "studentProgress", ignore = true)
    @Mapping(target = "removeStudentProgress", ignore = true)
    @Mapping(target = "user", ignore = true)
    StudentProfile toEntity(StudentProfileDTO studentProfileDTO);

    @Named("userProfileId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserProfile userProfileFromId(Long id);
}