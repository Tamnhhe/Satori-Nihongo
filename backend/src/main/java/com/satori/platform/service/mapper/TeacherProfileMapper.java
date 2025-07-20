package com.satori.platform.service.mapper;

import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.service.dto.TeacherProfileDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link TeacherProfile} and its DTO {@link TeacherProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface TeacherProfileMapper extends EntityMapper<TeacherProfileDTO, TeacherProfile> {}
