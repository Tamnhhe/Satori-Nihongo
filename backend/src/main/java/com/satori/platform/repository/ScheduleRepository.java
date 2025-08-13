package com.satori.platform.repository;

import com.satori.platform.domain.Schedule;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Spring Data JPA repository for the Schedule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
        /**
         * Find schedules between two dates
         */
        @Query("SELECT s FROM Schedule s WHERE s.date BETWEEN :startDate AND :endDate")
        List<Schedule> findByDateBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

        /**
         * Find schedules for a specific course between dates
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId AND s.date BETWEEN :startDate AND :endDate")
        List<Schedule> findByCourseIdAndDateBetween(@Param("courseId") Long courseId,
                        @Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);

        /**
         * Find conflicting schedules for a time slot
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId AND " +
                        "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
                        "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
                        "(s.startTime >= :startTime AND s.endTime <= :endTime))")
        List<Schedule> findConflictingSchedules(@Param("courseId") Long courseId,
                        @Param("startTime") Instant startTime,
                        @Param("endTime") Instant endTime);

        /**
         * Find schedules by course ID
         */
        List<Schedule> findByCourseId(Long courseId);

        /**
         * Find schedules for a teacher (through course)
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.teacher.id = :teacherId")
        List<Schedule> findByTeacherId(@Param("teacherId") Long teacherId);

        /**
         * Find upcoming schedules for a course
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId AND s.startTime > :currentTime ORDER BY s.startTime")
        List<Schedule> findUpcomingSchedulesByCourseId(@Param("courseId") Long courseId,
                        @Param("currentTime") Instant currentTime);

        /**
         * Find schedules by course ID with pagination
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId ORDER BY s.startTime")
        org.springframework.data.domain.Page<Schedule> findByCourseId(@Param("courseId") Long courseId,
                        org.springframework.data.domain.Pageable pageable);

        /**
         * Find schedules by teacher ID with pagination
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.teacher.id = :teacherId ORDER BY s.startTime")
        org.springframework.data.domain.Page<Schedule> findByTeacherId(@Param("teacherId") Long teacherId,
                        org.springframework.data.domain.Pageable pageable);

        /**
         * Find schedules by teacher and time range for conflict detection
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.teacher.id = :teacherId AND " +
                        "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
                        "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
                        "(s.startTime >= :startTime AND s.endTime <= :endTime))")
        List<Schedule> findByTeacherAndTimeRange(@Param("teacherId") Long teacherId,
                        @Param("startTime") Instant startTime,
                        @Param("endTime") Instant endTime);

        /**
         * Find schedules by location and time range for conflict detection
         */
        @Query("SELECT s FROM Schedule s WHERE s.location = :location AND " +
                        "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
                        "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
                        "(s.startTime >= :startTime AND s.endTime <= :endTime))")
        List<Schedule> findByLocationAndTimeRange(@Param("location") String location,
                        @Param("startTime") Instant startTime,
                        @Param("endTime") Instant endTime);

        /**
         * Find schedules by course ID ordered by date and start time
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId ORDER BY s.date ASC, s.startTime ASC")
        org.springframework.data.domain.Page<Schedule> findByCourseIdOrderByDateAscStartTimeAsc(
                        @Param("courseId") Long courseId,
                        org.springframework.data.domain.Pageable pageable);

        /**
         * Find teacher conflicts for scheduling
         */
        @Query("SELECT s FROM Schedule s WHERE s.course.teacher.id = :teacherId AND " +
                        "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
                        "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
                        "(s.startTime >= :startTime AND s.endTime <= :endTime))")
        List<Schedule> findTeacherConflicts(@Param("teacherId") Long teacherId,
                        @Param("startTime") Instant startTime,
                        @Param("endTime") Instant endTime);

        /**
         * Find location conflicts for scheduling
         */
        @Query("SELECT s FROM Schedule s WHERE UPPER(s.location) = UPPER(:location) AND " +
                        "((s.startTime <= :startTime AND s.endTime > :startTime) OR " +
                        "(s.startTime < :endTime AND s.endTime >= :endTime) OR " +
                        "(s.startTime >= :startTime AND s.endTime <= :endTime))")
        List<Schedule> findLocationConflicts(@Param("location") String location,
                        @Param("startTime") Instant startTime,
                        @Param("endTime") Instant endTime);
}
