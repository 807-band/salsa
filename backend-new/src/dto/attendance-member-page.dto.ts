import {Expose} from "class-transformer";

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
    eventPepBandId!: string | null;

    @Expose()
    eventDate!: Date;

    @Expose()
    subId!: number | null;

    @Expose()
    subFirstName!: string | null;

    @Expose()
    subLastName!: string | null;

}