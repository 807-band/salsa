import {Component, OnInit, ViewChild} from '@angular/core';
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
import {MatButton, MatIconButton} from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import {MatTooltip} from '@angular/material/tooltip';

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
    MatButton,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './volunteer-roster-page.component.html',
  styleUrl: './volunteer-roster-page.component.css'
})
export class VolunteerRosterPageComponent extends BaseComponent implements OnInit {

  event?: MBEvent;

  membersGroupedBySection: Array<[string, Member[]]> = [];

  eventLoaded: boolean = false;

  returnTo: string = '';

  emailList: string = '';
  copied: boolean = false;
  private copyTimeout?: ReturnType<typeof setTimeout>;

  @ViewChild('copyTooltip') copyTooltip!: MatTooltip;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private clipboard: Clipboard) {
    super();
  }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.returnTo = this.route.snapshot.paramMap.get('returnTo') ?? 'admin';

    const emails: string[] = [];

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

        emails.push(att.member.user.email);
      }

      this.membersGroupedBySection = Array.from(memberMap.entries());

      this.eventLoaded = true;

      this.emailList = emails.join('; ');
    })
  }

  copyEmailList() {
    this.clipboard.copy(this.emailList);

    this.copied = true;

    // Reset the timer if the user clicks multiple times
    clearTimeout(this.copyTimeout);

    // Force the tooltip to appear immediately
    setTimeout(() => this.copyTooltip.show(0), 0);

    this.copyTimeout = setTimeout(() => {
      this.copyTooltip.hide(0);
      this.copied = false;
    }, 1000);
  }

  goBack() {
    const url = this.returnTo == 'admin' ? ['/admin/term'] : ['/event', this.event?.eventId];
    this.router.navigate(url)
  }
}
