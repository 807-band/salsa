import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {EventAttendanceMemberPage} from '../../models/event-attendance-member-page';
import {Router} from '@angular/router';
import {Utilities} from '../../utilities/utilities';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-member-attendance-table',
  standalone: true,
  imports: [
    DatePipe,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    NgForOf,
    FormsModule,
    MatButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatCheckbox,
  ],
  templateUrl: './member-attendance-table.component.html',
  styleUrl: './member-attendance-table.component.css'
})
export class MemberAttendanceTableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input('attendances') attendances?: EventAttendanceMemberPage[];

  @ViewChild('attendancePaginator') attendancePaginator: MatPaginator | null = null;

  @ViewChild(MatTable) attendanceTable!: MatTable<EventAttendanceMemberPage>;

  attendanceColumns: string[] = ['event', 'type', 'date', 'status'];
  attendanceDataSource: MatTableDataSource<EventAttendanceMemberPage> = new MatTableDataSource<EventAttendanceMemberPage>(this.attendances);

  eventTypeOptions: string[] = [];
  attendanceStatusOptions: string[] = [];

  selectedEventTypes: string[] = [];
  selectedStatuses: string[] = [];


  constructor(private router: Router) {}

  ngOnInit() {
    this.attendanceDataSource.data = this.attendances ?? [];
    this.eventTypeOptions = Utilities.getEventTypeOptions();
    this.attendanceStatusOptions = Utilities.getAttendanceOptions(true);

    this.attendanceDataSource.filterPredicate = (data, filter: string) => {
      const { types, statuses } = JSON.parse(filter);

      const matchesType =
        types.length === 0 || types.includes(data.eventType);

      const matchesStatus =
        statuses.length === 0 || statuses.includes(data.attendanceStatus);

      return matchesType && matchesStatus;
    };
  }

  ngAfterViewInit() {
    this.attendanceDataSource.paginator = this.attendancePaginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['attendances']) {
      this.attendanceDataSource.data = this.attendances ?? [];
      this.attendanceDataSource.paginator = this.attendancePaginator;
    }
  }

  toggleEventType(type: string) {
    if (this.selectedEventTypes.includes(type)) {
      this.selectedEventTypes = this.selectedEventTypes.filter(t => t !== type);
    } else {
      this.selectedEventTypes.push(type);
    }

    this.applyFilters();
  }

  toggleStatus(status: string) {
    if (this.selectedStatuses.includes(status)) {
      this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
    } else {
      this.selectedStatuses.push(status);
    }

    this.applyFilters();
  }

  applyFilters() {
    this.attendanceDataSource.filter = JSON.stringify({
      types: this.selectedEventTypes,
      statuses: this.selectedStatuses
    });
  }

  navigateToAttendance(attendanceId: number) {
    this.router.navigate(['/attendance', attendanceId], {queryParams: {returnTo: 'member'}});
  }

}
