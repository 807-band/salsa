import {PepBand} from './pep-band';

export interface EventAttendanceMemberPage {
  attendanceId: number;
  attendanceStatus: string;
  eventId: number;
  eventTitle: string;
  eventType: string;
  eventDate: Date;
  eventPepBand: PepBand;
  subId: number;
  subFirstName: string;
  subLastName: string;
}
