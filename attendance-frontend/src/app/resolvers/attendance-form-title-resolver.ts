import { ResolveFn } from '@angular/router';

export const attendanceFormTitleResolver: ResolveFn<string> = route => {
  const type = route.queryParamMap.get('fromList');

  if (!type) return '';

  return type == 'volunteer' ? 'Volunteer Roster' : 'Enter Attendance';
};
