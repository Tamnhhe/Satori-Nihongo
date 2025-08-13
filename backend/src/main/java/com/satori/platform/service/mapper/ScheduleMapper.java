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
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseTitle", source = "course.title")
    @Mapping(target = "teacherId", source = "course.teacher.id")
    @Mapping(target = "teacherName", source = "course.teacher.fullName")
    ScheduleDTO toDto(Schedule s);

    @Mapping(target = "course", ignore = true)
    Schedule toEntity(ScheduleDTO dto);
}
