export interface EventAttendanceMemberPage {
  attendanceId: number;
  attendanceStatus: string;
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventDate: Date;
  eventPepBandId: string | null;
  subId: number;
  subFirstName: string;
  subLastName: string;
}
