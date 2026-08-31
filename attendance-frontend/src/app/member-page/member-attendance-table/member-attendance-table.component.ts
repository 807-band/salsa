import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
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
    MatHeaderCellDef
  ],
  templateUrl: './member-attendance-table.component.html',
  styleUrl: './member-attendance-table.component.css'
})
export class MemberAttendanceTableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input('attendances') attendances?: EventAttendanceMemberPage[];

  @ViewChild('attendancePaginator') attendancePaginator: MatPaginator | null = null;

  @ViewChild(MatTable) attendanceTable!: MatTable<EventAttendanceMemberPage>;

  attendanceColumns: string[] = ['event', 'type', 'date', 'status', 'subbedBy'];
  attendanceDataSource: MatTableDataSource<EventAttendanceMemberPage> = new MatTableDataSource<EventAttendanceMemberPage>(this.attendances);

  constructor(private router: Router) {}

  ngOnInit() {
    this.attendanceDataSource.data = this.attendances ?? [];
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

  navigateToAttendance(attendanceId: number) {
    this.router.navigate(['/attendance', attendanceId], {queryParams: {returnTo: 'member'}});
  }

}
