import {Expose, Type} from "class-transformer";
import {PepBandDto} from "./pep-band.dto";
import {TermDto} from "./term.dto";
import {VolunteerRosterMemberCount} from "../entities/volunteer-roster-member-count.entity";
import {VolunteerRosterMemberCountDto} from "./volunteer-roster-member-count.dto";
import {EventAttendanceDto} from "./event-attendance.dto";

export class MBEventDto {
    @Expose()
    eventId!: number;

    @Expose()
    type!: string;

    @Expose()
    title!: string;

    @Expose()
    date!: Date;

    @Expose()
    @Type(() => PepBandDto)
    pepBand!: PepBandDto;

    @Expose()
    extraAttendeesAllowed!: boolean;

    @Expose()
    @Type(() => TermDto)
    term!: TermDto;

    @Expose()
    @Type(() => EventAttendanceDto)
    attendances!: EventAttendanceDto[];

    @Expose()
    @Type(() => VolunteerRosterMemberCountDto)
    volunteerRosterMemberCounts!: VolunteerRosterMemberCountDto[];
}