package com.satori.platform.service.mapper;

import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.service.dto.CourseClassDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link StudentProfile} and its DTO {@link StudentProfileDTO}.
 */
@Mapper(componentModel = "spring")
public interface StudentProfileMapper extends EntityMapper<StudentProfileDTO, StudentProfile> {
    @Mapping(target = "classes", source = "classes", qualifiedByName = "courseClassIdSet")
    StudentProfileDTO toDto(StudentProfile s);

    @Mapping(target = "classes", ignore = true)
    @Mapping(target = "removeClasses", ignore = true)
    StudentProfile toEntity(StudentProfileDTO studentProfileDTO);

    @Named("courseClassId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseClassDTO toDtoCourseClassId(CourseClass courseClass);

    @Named("courseClassIdSet")
    default Set<CourseClassDTO> toDtoCourseClassIdSet(Set<CourseClass> courseClass) {
        return courseClass.stream().map(this::toDtoCourseClassId).collect(Collectors.toSet());
    }
}
