import {Expose} from "class-transformer";

export class VolunteerRosterSummaryDto {
    @Expose()
    eventId!: number;

    @Expose()
    title!: string;

    @Expose()
    date!: Date;

    @Expose()
    numberMembersAssigned!: number;

    @Expose()
    totalMembersNeeded!: number;
}