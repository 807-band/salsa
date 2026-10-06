import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Term} from '../models/term';
import {MBEvent} from '../models/mb-event';
import {Member} from '../models/member';
import {User} from '../models/user';
import {EventAttendanceTermPage} from '../models/event-attendance-term-page';
import {environment} from '../../environments/environment';
import {VolunteerRosterMemberCount} from '../models/volunteer-roster-member-count';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  public getTerms(): Observable<Term[]> {
    const url = this.baseUrl + '/terms';
    return this.http.get<Term[]>(url);
  }

  public getTermById(termId: number): Observable<Term> {
    const url = this.baseUrl + `/terms/${termId}`;
    return this.http.get<Term>(url);
  }

  public getVolunteerEventById(id: number): Observable<MBEvent> {
    const url = this.baseUrl + `/events/volunteer/${id}`;
    return this.http.get<MBEvent>(url);
  }

  public getEventsByTermId(id: number): Observable<MBEvent[]> {
    const url = this.baseUrl + `/events/term/${id}`;
    return this.http.get<MBEvent[]>(url);
  }

  public getMembersByTermId(id: number): Observable<Member[]> {
    const url = this.baseUrl + `/members/term/${id}`;
    return this.http.get<Member[]>(url);
  }

  public getAttendanceByTermIdAndSection(termId: number, sectionId: number | null, eventType: string): Observable<EventAttendanceTermPage[]> {
    const url = this.baseUrl + `/attendance/term/${termId}/section/${sectionId}/eventType/${eventType}`;
    return this.http.get<EventAttendanceTermPage[]>(url);
  }

  public getAttendanceByTermIdAndPepBandAndSection(termId: number, sectionId: number | null, pepBandId: string,
                                                   ignoreMemberPepBand: boolean): Observable<EventAttendanceTermPage[]> {
    const url = this.baseUrl +
      `/attendance/term/${termId}/section/${sectionId}/pepBand/${pepBandId}?ignoreMemberPepBand=${ignoreMemberPepBand}`;
    return this.http.get<EventAttendanceTermPage[]>(url);
  }

  public createEvent(event: MBEvent) {
    const url = this.baseUrl + '/events';
    return this.http.post<any>(url, event)
  }

  public updateEvent(event: MBEvent) {
    const url = this.baseUrl + `/events/${event.eventId}`;
    return this.http.put<MBEvent>(url, event);
  }

  public deleteEvent(eventId: number) {
    const url = this.baseUrl + `/events/${eventId}`;
    return this.http.delete(url);
  }

  public createTerm(term: Term): Observable<Term> {
    const url = this.baseUrl + '/terms';
    return this.http.post<Term>(url, term)
  }

  public updateTerm(term: Term): Observable<Term> {
    const url = this.baseUrl + `/terms/${term.termId}`;
    return this.http.put<Term>(url, term)
  }

  public createMember(member: Member): Observable<Member> {
    const url = this.baseUrl + '/members';
    return this.http.post<Member>(url, member);
  }

  public createUser(user: User): Observable<User> {
    const url = this.baseUrl + '/users';
    return this.http.post<User>(url, user);
  }

  public getAllUsers(): Observable<User[]> {
    const url = this.baseUrl + '/users';
    return this.http.get<User[]>(url);
  }

  public getUsersByRole(role: string): Observable<User[]> {
    const url = this.baseUrl + `/users/role/${role}`;
    return this.http.get<User[]>(url);
  }

  public uploadMemberCsv(formData: FormData, termId: number): any {
    const url = this.baseUrl + `/members/term/${termId}/uploadCsv`;
    return this.http.post<any>(url, formData);
  }

  public uploadRehearsalConflictsCsv(formData: FormData, termId: number): any {
    const url = this.baseUrl + `/members/term/${termId}/uploadRehearsalConflictsCsv`;
    return this.http.post<any>(url, formData);
  }

  public uploadRolesCsv(formData: FormData): any {
    const url = this.baseUrl + `/users/uploadRolesCsv`;
    return this.http.post<any>(url, formData);
  }

}
