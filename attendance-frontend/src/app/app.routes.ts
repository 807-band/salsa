import {Router, Routes} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {AttendanceFormComponent} from './attendance-form/attendance-form.component';
import {MemberPageComponent} from './member-page/member-page.component';
import {EventPageComponent} from './admin/event-page/event-page.component';
import {AttendancesComponent} from './admin/attendances/attendances.component';
import {UserPageComponent} from './user-page/user-page.component';
import {EventListComponent} from './event-list/event-list.component';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {AuthzGuard} from './authz.guard';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {EventAttendancePageComponent} from './event-attendance-page/event-attendance-page.component';
import {SectionPageComponent} from './section-page/section-page.component';
import { AuthResponseComponent } from './utilities/auth-response.component';
import {StationPageComponent} from './station-page/station-page.component';
import {StationPacketPageComponent} from './station-packet-page/station-packet-page.component';
import {StationsMenuPageComponent} from './stations-menu-page/stations-menu-page.component';
import {MemberListPageComponent} from './member-list-page/member-list-page.component';
import {StationListPageComponent} from './station-list-page/station-list-page.component';
import {StationPacketListPageComponent} from './station-packet-list-page/station-packet-list-page.component';
import {EvaluationPageComponent} from './evaluation-page/evaluation-page.component';
import {MemberStationsStatusPageComponent} from './member-stations-status-page/member-stations-status-page.component';
import {eventListTitleResolver} from './resolvers/event-list-title-resolver';
import {stationsListTitleResolver} from './resolvers/stations-list-title-resolver';
import {stationTitleResolver} from './resolvers/station-title-resolver';
import {stationPacketTitleResolver} from './resolvers/station-packet-title-resolver';
import {UsersPageComponent} from './admin/users-page/users-page.component';
import {StationsPageComponent} from './admin/stations-page/stations-page.component';
import {TermPageComponent} from './admin/term-page/term-page.component';
import {StationsProgressPageComponent} from './admin/stations-progress-page/stations-progress-page.component';
import {attendanceFormTitleResolver} from './resolvers/attendance-form-title-resolver';

export const routes: Routes = [
  {
    path: 'auth-response',
    component: AuthResponseComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/events?type=upcoming',
        pathMatch: 'full',
      },
      {
        path: 'events',
        component: EventListComponent,
        canActivate: [AuthzGuard],
        title: eventListTitleResolver,
        runGuardsAndResolvers: 'pathParamsOrQueryParamsChange'
      },
      {
        path: 'stations/evaluate',
        component: MemberListPageComponent,
        canActivate: [AuthzGuard],
        title: 'Evaluate'
      },
      {
        path: 'stations-list',
        component: StationListPageComponent,
        canActivate: [AuthzGuard],
        title: stationsListTitleResolver
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'admin/term',
        component: TermPageComponent,
        canActivate: [AuthzGuard],
        title: 'View Term'
      },
      {
        path: 'admin/users',
        component: UsersPageComponent,
        canActivate: [AuthzGuard],
        title: 'Users'
      },
      {
        path: 'admin/stations',
        component: StationsPageComponent,
        canActivate: [AuthzGuard],
        title: 'Stations'
      },
      {
        path: 'admin/stations-progress',
        component: StationsProgressPageComponent,
        canActivate: [AuthzGuard],
        title: 'Stations Progress'
      },
      {
        path: 'admin/attendance',
        component: AttendancesComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'attendance-form/:id',
        component: AttendanceFormComponent,
        canActivate: [AuthzGuard],
        title: attendanceFormTitleResolver
      },
      {
        path: 'member/:id',
        component: MemberPageComponent,
        canActivate: [AuthzGuard],
        title: 'Member'
      },
      {
        path: 'member/:id/stations',
        component: MemberStationsStatusPageComponent,
        canActivate: [AuthzGuard],
        title: 'Evaluate'
      },
      {
        path: 'user/:id',
        component: UserPageComponent,
        canActivate: [AuthzGuard],
        title: 'User'
      },
      {
        path: 'event/:id',
        component: EventPageComponent,
        canActivate: [AuthzGuard],
        title: 'Event'
      },
      {
        path: 'section/:id',
        component: SectionPageComponent,
        canActivate: [AuthzGuard],
        title: 'View Section'
      },
      {
        path: 'attendance/:id',
        component: EventAttendancePageComponent,
        canActivate: [AuthzGuard],
        title: 'Attendance'
      },
      {
        path: 'station/:id',
        component: StationPageComponent,
        canActivate: [AuthzGuard]
      },
      {
        path: 'station/:id/packets',
        component: StationPacketListPageComponent,
        canActivate: [AuthzGuard],
        title: stationTitleResolver
      },
      {
        path: 'packet/:id',
        component: StationPacketPageComponent,
        canActivate: [AuthzGuard],
        title: stationPacketTitleResolver
      },
      {
        path: 'evaluation/:id',
        component: EvaluationPageComponent,
        canActivate: [AuthzGuard],
        title: 'Evaluate'
      }
    ]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: '/upcoming-events',
  },
];
