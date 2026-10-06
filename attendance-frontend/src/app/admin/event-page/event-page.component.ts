import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../../services/event.service';
import {MBEvent} from '../../models/mb-event';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {PepBand} from '../../models/pep-band';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Constants} from '../../utilities/constants';
import {SessionCacheService} from '../../services/session-cache.service';
import {AdminService} from '../../services/admin.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButton} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {VolunteerRosterMemberCount} from '../../models/volunteer-roster-member-count';
import {MatDivider} from '@angular/material/divider';
import {MatCheckbox} from '@angular/material/checkbox'

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    NgForOf,
    MatButton,
    MatDialogActions,
    MatDialogTitle,
    DatePipe,
    MatDivider,
    MatCheckbox,
    MatIcon
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.css'
})
export class EventPageComponent implements OnInit {

  event: MBEvent | null = null;

  private _snackBar = inject(MatSnackBar);

  @ViewChild('eventForm') eventForm!: NgForm;

  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  confirmDeleteDialogRef!: MatDialogRef<any>;

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  successDialogRef!: MatDialogRef<any>;

  eventTitle: string = "";
  eventType: string | null = null;
  eventPepBand: PepBand | null = null;
  eventDate: Date | null = null;
  eventTime: string = '';
  extraAttendeesAllowed: boolean = true;

  eventTypeOptions: string[] = [
    Constants.EVENT_TYPE_WHOLE_BAND_EVENT,
    Constants.EVENT_TYPE_PEP_EVENT,
    Constants.EVENT_TYPE_REHEARSAL
  ]

  pepBandOptions: PepBand[] = [];

  volunteerRosterMemberCounts: VolunteerRosterMemberCount[] = [];
  editing: boolean = false;

  constructor(private route: ActivatedRoute,
              private eventService: EventService,
              private router: Router,
              public sessionCacheService: SessionCacheService,
              private adminService: AdminService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    this.pepBandOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_PEP_BANDS);

    this.eventService.getEvent(eventId).subscribe(event => {
      this.event = event;

      this.eventTitle = event.title;
      this.eventType = event.type;
      this.eventPepBand = this.pepBandOptions.find(band => band.bandId === event.pepBand?.bandId) ?? null;
      this.extraAttendeesAllowed = event.extraAttendeesAllowed ?? true;
      this.volunteerRosterMemberCounts = event.volunteerRosterMemberCounts;
      this.separateDateAndTimeInputs(new Date(event.date));
    })
  }

  saveEvent(form: NgForm) {
    this.combineDateAndTimeInputs();

    let newEvent = {
      eventId: this.event?.eventId,
      type: form.value.eventType,
      title: form.value.eventTitle,
      date: form.value.eventDate,
      pepBand: form.value.eventPepBand ?? null,
      extraAttendeesAllowed: form.value.extraAttendeesAllowed ?? null,
      term: this.event?.term,
      volunteerRosterMemberCounts: this.volunteerRosterMemberCounts
    } as MBEvent;

    this.adminService.updateEvent(newEvent).subscribe(() => {
      this.event = newEvent;
      this.separateDateAndTimeInputs(newEvent.date);
      this.openSnackBar("Event updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating event", "Ok", 3000);
    })
  }

  openConfirmationDialog() {
    this.confirmDeleteDialogRef = this.dialog.open(this.confirmDeleteDialog);
  }

  openSuccessDialog() {
    this.successDialogRef = this.dialog.open(this.successDialog);
  }

  cancelDialog() {
    this.dialog.closeAll();
  }

  deleteEvent() {
    if (!this.event) {
      return;
    }
    this.cancelDialog();
    this.adminService.deleteEvent(this.event.eventId).subscribe(() => {
      this.openSuccessDialog();
    }, error => {
      console.log(error);
      this.openSnackBar("Error deleting event", "Ok", 3000);
    })
  }

  goBack() {
    this.cancelDialog();
    this.router.navigate(['/admin/term'])
  }

  edit() {
    this.eventTitle = this.event?.title ?? "";
    this.eventType = this.event?.type ?? null;
    this.eventDate = this.event?.date ? new Date(this.event?.date) : null;
    this.eventPepBand = this.pepBandOptions.find(b => b.bandId == this.event?.pepBand?.bandId) ?? null;

    this.editing = true;
  }

  cancel() {
    this.editing = false;
  }

  separateDateAndTimeInputs(dateAndTime: Date) {
    if (!dateAndTime) return;

    // Set eventDate to just the date (clone without time)
    this.eventDate = new Date(
      dateAndTime.getFullYear(),
      dateAndTime.getMonth(),
      dateAndTime.getDate()
    );

    // Format the time as 'HH:mm'
    const hours = dateAndTime.getHours().toString().padStart(2, '0');
    const minutes = dateAndTime.getMinutes().toString().padStart(2, '0');
    this.eventTime = `${hours}:${minutes}`;
  }

  combineDateAndTimeInputs() {
    const [hours, minutes] = this.eventTime.split(':').map(Number);
    this.eventDate?.setHours(hours, minutes, 0);
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

  navigateToRoster() {
    this.router.navigate(['/event', this.event?.eventId, 'roster'], {queryParams: {returnTo: 'event'}})
  }

  readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;
  readonly PEP_BAND_ID_VOLUNTEER = Constants.PEP_BAND_ID_VOLUNTEER;
}
