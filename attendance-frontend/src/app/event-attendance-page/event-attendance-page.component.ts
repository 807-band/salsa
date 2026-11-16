import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventAttendance} from '../models/event-attendance';
import {AttendanceService} from '../services/attendance.service';
import {DatePipe, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Utilities} from '../utilities/utilities';
import {Constants} from '../utilities/constants';
import {AttendanceSelectComponent} from '../attendance-form/attendance-select/attendance-select.component';
import {MemberSelectComponent} from '../attendance-form/member-select/member-select.component';
import {MemberService} from '../services/member.service';
import {Member} from '../models/member';
import {MatDivider} from '@angular/material/divider';

@Component({
  selector: 'app-event-attendance-page',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatButton,
    MatIcon,
    NgIf,
    ReactiveFormsModule,
    AttendanceSelectComponent,
    MemberSelectComponent,
    MatDivider
  ],
  templateUrl: './event-attendance-page.component.html',
  styleUrl: './event-attendance-page.component.css'
})
export class EventAttendancePageComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  readonly PEP_EVENT: string = Constants.EVENT_TYPE_PEP_EVENT;
  readonly REHEARSAL: string = Constants.EVENT_TYPE_REHEARSAL;

  private attendanceId: number = -1;

  public eventAttendance!: EventAttendance;
  editing: boolean = false;

  form: FormGroup;

  attendanceOptions: string[] = [];

  sectionMembers: Member[] = [];

  returnToPage: string = 'member'

  constructor(private route: ActivatedRoute,
              private attendanceService: AttendanceService,
              private router: Router,
              private fb: FormBuilder,
              private memberService: MemberService) {
    this.form = this.fb.group({
      attendance: [this.eventAttendance?.attendance],
      sub: [this.eventAttendance?.sub]
    })
  }

  ngOnInit() {
    this.attendanceId = Number(this.route.snapshot.paramMap.get('id'));

    this.returnToPage = this.route.snapshot.queryParams['returnTo'];

    this.attendanceService.getAttendanceById(this.attendanceId).subscribe((attendance) => {
      this.eventAttendance = attendance;

      let sectionId = attendance.section?.sectionId;
      if (sectionId) {
        this.memberService.getMembersBySectionAndTermId(sectionId, this.eventAttendance.member!.term.termId).subscribe(members => {
          this.sectionMembers = members;
        })
      }

      this.attendanceOptions = Utilities.getAttendanceOptions(this.eventAttendance?.mbEvent?.type === this.PEP_EVENT);
    }, error => {
      console.log(error)
    })
  }

  edit() {
    this.form.controls['attendance'].setValue(this.eventAttendance?.attendance ?? '');
    this.form.controls['sub'].setValue(this.eventAttendance?.sub);
    this.editing = true;
  }

  save() {
    if (!this.eventAttendance) {
      return;
    }
    this.eventAttendance.attendance = this.form.value.attendance;
    if (this.eventAttendance.attendance === 'Sub') {
      this.eventAttendance.sub = this.form.value.sub;
    }

    this.attendanceService.updateAttendance(this.attendanceId, this.eventAttendance).subscribe(att => {
      this.eventAttendance.lastUpdated = att.lastUpdated;
      this.openSnackBar("Attendance updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating attendance", "Ok", 3000);
    })
  }

  cancel() {
    this.editing = false;
  }


  goBack() {
    if (this.returnToPage == 'attendance') {
      this.router.navigate(['/attendance/term', this.eventAttendance.member?.term?.termId]);
    } else if (this.returnToPage == 'member') {
      this.router.navigate(['/member', this.eventAttendance.member?.memberId]);
    } else if (this.returnToPage == 'section') {
      this.router.navigate(['/section', this.eventAttendance.member?.section?.sectionId]);
    }

  }

  includeSubOption(): boolean {
    return this.eventAttendance?.mbEvent?.type === Constants.EVENT_TYPE_PEP_EVENT;
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }
}
