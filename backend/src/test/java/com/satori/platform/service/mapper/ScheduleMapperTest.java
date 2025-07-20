package com.satori.platform.service.mapper;

import static com.satori.platform.domain.ScheduleAsserts.*;
import static com.satori.platform.domain.ScheduleTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ScheduleMapperTest {

    private ScheduleMapper scheduleMapper;

    @BeforeEach
    void setUp() {
        scheduleMapper = new ScheduleMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getScheduleSample1();
        var actual = scheduleMapper.toEntity(scheduleMapper.toDto(expected));
        assertScheduleAllPropertiesEquals(expected, actual);
    }
}
