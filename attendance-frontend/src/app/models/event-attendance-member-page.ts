export interface EventAttendanceMemberPage {
  attendanceId: number;
  attendanceStatus: string;
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventDate: Date;
  eventPepBandId: string | null;
  memberId: number;
  memberFirstName: string;
  memberLastName: string;
  subId: number;
  subFirstName: string;
  subLastName: string;
}
