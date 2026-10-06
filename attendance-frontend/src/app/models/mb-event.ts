import {PepBand} from './pep-band';
import {Term} from './term';
import {VolunteerRosterMemberCount} from './volunteer-roster-member-count';
import {EventAttendance} from './event-attendance';

export interface MBEvent {
  eventId: number;
  type: string;
  title: string;
  date: Date;
  pepBand: PepBand | null;
  extraAttendeesAllowed?: boolean;
  term: Term;
  attendances: EventAttendance[];
  volunteerRosterMemberCounts: VolunteerRosterMemberCount[];
}
