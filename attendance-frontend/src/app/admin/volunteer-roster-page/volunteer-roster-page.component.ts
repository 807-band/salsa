import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MBEvent} from '../../models/mb-event';
import {AdminService} from '../../services/admin.service';
import {Member} from '../../models/member';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {BaseComponent} from '../../base-component';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-volunteer-roster-page',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinner,
    RouterLink,
    DatePipe,
    MatIcon,
    NgForOf,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatButton
  ],
  templateUrl: './volunteer-roster-page.component.html',
  styleUrl: './volunteer-roster-page.component.css'
})
export class VolunteerRosterPageComponent extends BaseComponent implements OnInit {

  event?: MBEvent;

  membersGroupedBySection: Array<[string, Member[]]> = [];

  eventLoaded: boolean = false;

  returnTo: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.returnTo = this.route.snapshot.paramMap.get('returnTo') ?? 'admin';

    this.adminService.getVolunteerEventById(eventId).subscribe(e => {
      this.event = e;

      const memberMap = new Map<string, Member[]>();

      for (let att of e.attendances) {
        // this null check is already included when fetching from the database - this is just so typescript doesn't complain
        if (!att.member) {
          continue;
        }

        let sectionName = att.section.name;
        let members = memberMap.get(sectionName) ?? [];

        members.push(att.member)
        memberMap.set(sectionName, members);
      }

      this.membersGroupedBySection = Array.from(memberMap.entries());

      this.eventLoaded = true;
    })
  }

  goBack() {
    const url = this.returnTo == 'admin' ? ['/admin/term'] : ['/event', this.event?.eventId];
    this.router.navigate(url)
  }
}
