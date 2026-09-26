import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../services/event.service';
import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {MatFormField, MatLabel, MatOption, MatSelect, MatSuffix} from '@angular/material/select';
import {
  FormArray,
  FormBuilder,
  FormGroup, FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatRow, MatRowDef,
  MatTable,
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Constants} from '../utilities/constants';
import {Utilities} from '../utilities/utilities';
import {MBEvent} from '../models/mb-event';
import {EventAttendance} from '../models/event-attendance';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SessionCacheService} from '../services/session-cache.service';
import {Member} from '../models/member';
import {MemberService} from '../services/member.service';
import {Section} from '../models/section';
import {AttendanceSelectComponent} from './attendance-select/attendance-select.component';
import {MemberSelectComponent} from './member-select/member-select.component';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    MatSelect,
    MatOption,
    NgForOf,
    MatFormField,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatCell,
    MatCellDef,
    MatRow,
    MatRowDef,
    MatButton,
    MatIcon,
    NgStyle,
    MatLabel,
    FormsModule,
    MatIconButton,
    AttendanceSelectComponent,
    MemberSelectComponent,
    MatDialogActions,
    MatDialogTitle,
    MatCheckbox,
    MatDialogContent,
  ],
  templateUrl: './attendance-form.component.html',
  styleUrl: './attendance-form.component.css'
})
export class AttendanceFormComponent implements OnInit {

  readonly PEP_EVENT: string = Constants.EVENT_TYPE_PEP_EVENT;
  readonly REHEARSAL: string = Constants.EVENT_TYPE_REHEARSAL;

  public selectedSection: Section | null = null;

  public sectionOptions: Section[] = [];

  eventId!: number;

  event!: MBEvent;

  private _snackBar = inject(MatSnackBar);

  @ViewChild('confirmSubmitDialog') confirmSubmitDialog!: TemplateRef<any>;
  confirmSubmitDialogRef!: MatDialogRef<any>;

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  successDialogRef!: MatDialogRef<any>;

  eventAttendances: EventAttendance[] = [];

  attendanceOptions: string[] = []

  form: FormGroup;

  columnsToDisplay = ['name'];

  sectionMembers: Member[] = [];

  showRequiredFieldError: boolean = false;

  showSubError: boolean = false;

  showDuplicateMemberError: boolean = false;

  fromList: string = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private eventService: EventService,
              private fb: FormBuilder,
              public sessionCacheService: SessionCacheService,
              private memberService: MemberService,
              private dialog: MatDialog) {
    this.form = this.fb.group({
      attendances: this.fb.array([])
    });
  }

  get attendances() {
    return this.form.get('attendances') as FormArray
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fromList = params['fromList'] || 'upcoming';
      if (this.fromList != 'volunteer') {
        this.columnsToDisplay.push('attendance');
      }
    })

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

    let sectionId = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION).sectionId;
    this.sectionMembers = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTION_MEMBERS);

    this.eventService.getEvent(this.eventId).subscribe(event => {
      this.event = event;
      this.attendanceOptions = Utilities.getAttendanceOptions(this.event?.type === this.PEP_EVENT);

      if (this.event?.type !== Constants.EVENT_TYPE_WHOLE_BAND_EVENT && this.event?.type !== Constants.EVENT_TYPE_REHEARSAL) {
        this.columnsToDisplay.push('delete');
      }
    })

    this.eventService.getEventAttendance(this.eventId, sectionId).subscribe(attendances => {
      attendances.forEach(att => {
        this.eventAttendances.push(att);
      });
      this.form = this.fb.group({
        attendances: this.fb.array(attendances.map((att) =>
          this.fb.group({
            attendanceId: [att.attendanceId],
            member: [att.member],
            attendance: [att.attendance],
            sub: [att.sub],
            required: [att.required]
          })
        ))
      });

      this.form.valueChanges.subscribe(() => {
        this.clearErrors();
      });
    })

    this.sectionOptions = this.sessionCacheService.isDrumlineAttendanceTaker()
      ? this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS).filter((section: Section) => Utilities.isDrumline(section))
      : this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS);

    this.selectedSection = this.sectionOptions
      .find((section: Section) => section.sectionId == sectionId) ?? null;
  }

  onSectionChange(section: Section) {
    let sectionId = section.sectionId;

    this.memberService.getMembersBySectionAndTermId(sectionId, this.event.term.termId).subscribe(members => {
      this.sectionMembers = members;
    })

    if (!this.eventId) {
      return;
    }

    this.eventService.getEventAttendance(this.eventId, sectionId).subscribe(attendances => {
      this.eventAttendances = [];

      attendances.forEach(att => {
        this.eventAttendances.push(att);
      });
      this.form = this.fb.group({
        attendances: this.fb.array(attendances.map((att) =>
          this.fb.group({
            attendanceId: [att.attendanceId],
            member: [att.member],
            attendance: [att.attendance],
            sub: [att.sub],
            required: [att.required]
          })
        ))
      });
    })
  }

  public onSubmit() {

    this.cancelDialog();

    this.eventService.submitAttendanceForm(this.eventAttendances).subscribe(() => {
      this.openSuccessDialog();
    }, error => {
      console.log(error);
      this.openSnackBar("Error submitting form", "Ok", 3000);
    })
  }

  openConfirmationDialog() {
    let errors = this.validateForm();

    if (errors == 0) {
      this.confirmSubmitDialogRef = this.dialog.open(this.confirmSubmitDialog);
    }
  }

  openSuccessDialog() {
    this.successDialogRef = this.dialog.open(this.successDialog);
  }

  cancelDialog() {
    this.dialog.closeAll();
  }

  private validateForm() {
    this.clearErrors()
    const formGroups = this.attendances.controls;
    let errors: number = 0;
    let seenMemberIds: number[] = [];
    for (let i = 0; i < this.eventAttendances.length; i++) {
      const group = formGroups[i];
      const member = group.get('member')?.value;
      const attendance = group.get('attendance')?.value;
      const sub = group.get('sub')?.value;
      const required = group.get('required')?.value;

      if (!member) {
        group.get('member')?.setErrors({required: true});
        this.showRequiredFieldError = true;
        errors++;
      }

      if (attendance == Constants.ATTENDANCE_SUB && !sub) {
        group.get('sub')?.setErrors({required: true})
        this.showSubError = true;
        errors++;
      }

      if (seenMemberIds.includes(member?.memberId) || (attendance == Constants.ATTENDANCE_SUB && seenMemberIds.includes(sub?.memberId))) {
        this.showDuplicateMemberError = true;
        errors++;
      }

      seenMemberIds.push(member?.memberId);

      if (attendance == Constants.ATTENDANCE_SUB) {
        seenMemberIds.push(sub?.memberId);
      }

      this.eventAttendances[i].member = member;
      this.eventAttendances[i].attendance = attendance;
      this.eventAttendances[i].sub = sub;
      this.eventAttendances[i].required = required;
    }
    return errors;
  }

  public markAllPresent() {
    this.attendances.controls.forEach(control => {
      let group = control as FormGroup;
      if (!group.get('attendance')?.value) {
        group.get('attendance')?.setValue(Constants.ATTENDANCE_PRESENT);
      }
    })
  }

  onPresentCheckboxChange(checked: boolean, index: number) {
    const attendanceControl = this.attendances.at(index).get('attendance');
    if (attendanceControl) {
      if (checked) {
        attendanceControl.setValue(Constants.ATTENDANCE_PRESENT);
      } else if (attendanceControl.value === Constants.ATTENDANCE_PRESENT) {
        attendanceControl.setValue(null);
      }
    }
  }

  public clearForm() {
    this.attendances.controls.forEach(control => {
      let group = control as FormGroup;
      group.get('attendance')?.setValue('');
    })
  }

  public addAttendee() {
    const newAttendance = {
      attendanceId: -1, // ID will get generated in the backend
      mbEvent: this.event,
      attendance: null,
      member: null,
      sub: null,
      required: false,
      section: this.selectedSection
    } as EventAttendance;

    this.eventService.addAttendance(newAttendance).subscribe(response => {
      newAttendance.attendanceId = response.attendanceId;
      this.eventAttendances.push(newAttendance);
      this.eventAttendances = [...this.eventAttendances];
      this.attendances.push(
        this.fb.group({
          attendanceId: [response.attendanceId],
          member: [null],
          attendance: [null],
          sub: [null],
          required: [false]
        })
      );
    }, error => {
      console.log(error);
      this.openSnackBar("Error Adding Attendee", "Ok", 3000);
    })
  }

  public removeAttendee(eventAttendance: EventAttendance) {
    let attendanceId = eventAttendance.attendanceId;
    this.eventService.removeAttendance(attendanceId).subscribe(() => {
      this.eventAttendances = this.eventAttendances.filter(a => a.attendanceId != attendanceId);
      const index = this.attendances.controls.findIndex(ctrl => ctrl.get('attendanceId')?.value === attendanceId);
      this.attendances.removeAt(index);

    }, error => {
      console.log(error);
      this.openSnackBar("Error Removing Attendee", "Ok", 3000);
    })
  }

  getAvailableMembers(i: number): Member[] {
    let members = this.sectionMembers.filter(m =>
      !this.eventAttendances.some(a => a.required && a.member?.memberId === m.memberId)
    );
    return members
  }

  includeSubOption(): boolean {
    return this.event?.type === Constants.EVENT_TYPE_PEP_EVENT;
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  goBack() {
    this.cancelDialog();
    this.router.navigate(['/events'], { queryParams: { type: this.fromList } })
  }

  clearErrors() {
    this.showRequiredFieldError = false;
    this.showSubError = false;
    this.showDuplicateMemberError = false;

  }

  protected readonly Utilities = Utilities;
  protected readonly Constants = Constants
}
