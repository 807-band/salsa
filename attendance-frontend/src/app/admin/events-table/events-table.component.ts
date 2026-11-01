import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSelect} from '@angular/material/select';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {PepBand} from '../../models/pep-band';
import {MBEvent} from '../../models/mb-event';
import {FormsModule, NgForm} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {Constants} from '../../utilities/constants';
import {Term} from '../../models/term';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SessionCacheService} from '../../services/session-cache.service';
import {AdminService} from '../../services/admin.service';
import {Router} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-events-table',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatLabel,
    MatOption,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSelect,
    MatTable,
    NgForOf,
    MatHeaderCellDef,
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatSuffix,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './events-table.component.html',
  styleUrl: './events-table.component.css'
})
export class EventsTableComponent implements OnInit, AfterViewInit {

  private _snackBar = inject(MatSnackBar);

  @ViewChild('createEventDialog') createEventDialog!: TemplateRef<any>;
  eventDialogRef!: MatDialogRef<any>;

  @ViewChild('eventPaginator') eventPaginator: MatPaginator | null = null;

  @ViewChild('eventForm') eventForm!: NgForm;

  @Input('selectedTerm') selectedTerm: Term | null = null;

  eventTypeOptions: string[] = [
    Constants.EVENT_TYPE_WHOLE_BAND_EVENT,
    Constants.EVENT_TYPE_PEP_EVENT,
    Constants.EVENT_TYPE_REHEARSAL
  ]

  pepBandOptions: PepBand[] = [];

  events: MBEvent[] = [];
  eventColumns: string[] = ['event', 'pepBand', 'date'];
  eventDataSource: MatTableDataSource<MBEvent> = new MatTableDataSource<MBEvent>(this.events);

  eventTitle: string = "";
  eventType: string | null = null;
  eventPepBand: PepBand | null = null;
  eventDate: Date | null = null;
  eventTime: string = '';

  submitting: boolean = false;

  constructor(private adminService: AdminService,
              private dialog: MatDialog,
              private sessionCacheService: SessionCacheService,
              private router: Router) {
  }

  ngAfterViewInit() {
    this.eventDataSource.paginator = this.eventPaginator;
  }

  ngOnInit() {
    this.pepBandOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_PEP_BANDS);
  }

  openEventDialog() {
    this.eventDialogRef = this.dialog.open(this.createEventDialog)
  }

  onCancelDialog() {
    setTimeout(() => {
      this.eventForm?.reset();
    });
    this.dialog.closeAll();
  }

  onTermChange(newTermId: number) {
    this.events = [];
    this.adminService.getEventsByTermId(newTermId).subscribe(events => {
      this.events = events;
      this.eventDataSource = new MatTableDataSource<MBEvent>(this.events);
      this.eventDataSource.paginator = this.eventPaginator;
    });
  }

  submitEvent(form: NgForm) {
    this.submitting = true;

    this.combineDateAndTimeInputs();

    let newEvent = {
      eventId: -1, // will get assigned when the backend puts it in the database
      type: form.value.eventType,
      title: form.value.eventTitle,
      date: form.value.eventDate,
      pepBand: form.value.eventPepBand ?? null,
      term: this.selectedTerm
    } as MBEvent;

    this.adminService.createEvent(newEvent).subscribe(response => {
      newEvent.eventId = response.eventId;
      this.events.push(newEvent);
      this.eventDataSource = new MatTableDataSource(this.events);
      this.eventDataSource.paginator = this.eventPaginator;
      this.openSnackBar("Event created!", "Ok", 3000);
      form.reset();
      this.submitting = false;
      this.eventDialogRef.close();
    }, error => {
      console.log(error);
      this.submitting = false;
      this.openSnackBar("Error creating event", "Ok", 3000);
    })
  }

  combineDateAndTimeInputs() {
    const [hours, minutes] = this.eventTime.split(':').map(Number);
    this.eventDate?.setHours(hours, minutes, 0);
  }

  navigateToEvent(eventId: number) {
    this.router.navigate(['/event', eventId]);
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }


  readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT
}
