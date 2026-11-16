import { plainToInstance } from 'class-transformer';
import { EventAttendance } from '../entities/event-attendance.entity';
import { EventAttendanceDto } from '../dto/event-attendance.dto';
import { toMbEventDto } from './mb-event.mapper';
import { toMemberDto } from './member.mapper';
import { toSectionDto } from './section.mapper';
import {AttendanceTermPageDto} from "../dto/attendance-term-page.dto";
import {AttendanceMemberPageDto} from "../dto/attendance-member-page.dto";
import {toPepBandDto} from "./pepBand.mapper";

export function toEventAttendanceDto(attendance: EventAttendance): EventAttendanceDto {
    const plainObj = {
        attendanceId: attendance.attendanceId,
        attendance: attendance.attendance,
        required: attendance.required,
        lastUpdated: attendance.lastUpdated,

        mbEvent: attendance.mbEvent ? toMbEventDto(attendance.mbEvent) : null,
        member: attendance.member ? toMemberDto(attendance.member) : null,
        sub: attendance.sub ? toMemberDto(attendance.sub) : null,
        section: attendance.section ? toSectionDto(attendance.section) : null,
    };

    return plainToInstance(EventAttendanceDto, plainObj, { excludeExtraneousValues: true });
}

export function toAttendanceMemberPageDto(attendance: EventAttendance) : AttendanceMemberPageDto {
    const plainObj = {
        attendanceId: attendance.attendanceId,
        attendanceStatus: attendance.attendance,

        eventId: attendance.mbEvent.eventId,
        eventTitle: attendance.mbEvent.title,
        eventType: attendance.mbEvent.type,
        eventDate: attendance.mbEvent.date,

        eventPepBandId: attendance.mbEvent.pepBand ? attendance.mbEvent.pepBand.bandId : null,
        subId: attendance.sub ? attendance.sub.memberId : null,
        subFirstName: attendance.sub ? attendance.sub.user.firstName : null,
        subLastName: attendance.sub ? attendance.sub.user.lastName : null,
        section: attendance.section ? toSectionDto(attendance.section) : null,
    };

    return plainToInstance(AttendanceMemberPageDto, plainObj, { excludeExtraneousValues: true });
}
