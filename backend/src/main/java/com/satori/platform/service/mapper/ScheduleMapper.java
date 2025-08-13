package com.satori.platform.service.mapper;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Schedule;
import com.satori.platform.service.dto.CourseDTO;
import com.satori.platform.service.dto.ScheduleDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Schedule} and its DTO {@link ScheduleDTO}.
 */
@Mapper(componentModel = "spring")
public interface ScheduleMapper extends EntityMapper<ScheduleDTO, Schedule> {
    @Mapping(target = "course", source = "course", qualifiedByName = "courseId")
    ScheduleDTO toDto(Schedule s);

    @Named("courseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CourseDTO toDtoCourseId(Course course);
}
