import {Expose, Type} from "class-transformer";
import {PepBandDto} from "./pep-band.dto";

export class AttendanceMemberPageDto {
    @Expose()
    attendanceId!: number;

    @Expose()
    attendanceStatus!: string | null;

    @Expose()
    eventId!: number;

    @Expose()
    eventTitle!: string;

    @Expose()
    eventType!: string;

    @Expose()
    @Type(() => PepBandDto)
    eventPepBand!: PepBandDto;

    @Expose()
    eventDate!: Date;

    @Expose()
    subId!: number | null;

    @Expose()
    subFirstName!: string | null;

    @Expose()
    subLastName!: string | null;

}