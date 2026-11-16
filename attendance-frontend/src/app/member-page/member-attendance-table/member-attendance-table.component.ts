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
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatDivider} from '@angular/material/divider';

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
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
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
  eventTypeFilter: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.attendanceDataSource.data = this.attendances ?? [];
    this.eventTypeOptions = Utilities.getEventTypeOptions();
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

  updateEventTypeFilter() {
    if (this.eventTypeFilter) {
      this.attendanceDataSource = new MatTableDataSource(
        this.attendances?.filter(attendance => attendance.eventType == this.eventTypeFilter)
      )
    } else {
      this.attendanceDataSource = new MatTableDataSource(this.attendances);
    }
    this.attendanceDataSource.paginator = this.attendancePaginator;
  }

  navigateToAttendance(attendanceId: number) {
    this.router.navigate(['/attendance', attendanceId], {queryParams: {returnTo: 'member'}});
  }

}
