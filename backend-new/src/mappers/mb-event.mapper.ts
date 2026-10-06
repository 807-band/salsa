import {plainToInstance} from "class-transformer";
import {MBEvent} from "../entities/mb-event.entity";
import {MBEventDto} from "../dto/mb-event.dto";
import {toPepBandDto} from "./pepBand.mapper";
import {toTermDto} from "./term.mapper";
import {toVolunteerRosterMemberCountDto} from "./volunteer-roster-member-count.mapper";
import {toEventAttendanceDto} from "./attendance.mapper";

export function toMbEventDto(mbEvent: MBEvent): MBEventDto {
    const plainObj = {
        eventId: mbEvent.eventId,
        type: mbEvent.type,
        title: mbEvent.title,
        date: mbEvent.date,
        extraAttendeesAllowed: mbEvent.extraAttendeesAllowed,

        pepBand: mbEvent.pepBand ? toPepBandDto(mbEvent.pepBand) : null,
        term: mbEvent.term ? toTermDto(mbEvent.term) : null,

        attendances: mbEvent.attendances
            ? mbEvent.attendances.map(toEventAttendanceDto)
            : [],
        volunteerRosterMemberCounts: mbEvent.volunteerRosterMemberCounts
            ? mbEvent.volunteerRosterMemberCounts.map(toVolunteerRosterMemberCountDto)
            : [],
    };

    return plainToInstance(MBEventDto, plainObj, { excludeExtraneousValues: true });
}
