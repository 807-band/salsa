import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {EventsTableComponent} from '../events-table/events-table.component';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MembersTableComponent} from '../members-table/members-table.component';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Term} from '../../models/term';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {AdminService} from '../../services/admin.service';
import {SessionCacheService} from '../../services/session-cache.service';
import {Router} from '@angular/router';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {BaseComponent} from '../../base-component';
import {Constants} from '../../utilities/constants';
import {EventService} from '../../services/event.service';
import {MBEvent} from '../../models/mb-event';
import {VolunteerEventCardComponent} from './volunteer-event-card/volunteer-event-card.component';

@Component({
  selector: 'app-term-page',
  standalone: true,
  imports: [
    DatePipe,
    EventsTableComponent,
    MatAccordion,
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    MembersTableComponent,
    NgForOf,
    FormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatSuffix,
    ReactiveFormsModule,
    NgIf,
    VolunteerEventCardComponent
  ],
  templateUrl: './term-page.component.html',
  styleUrl: './term-page.component.css'
})
export class TermPageComponent extends BaseComponent implements OnInit {
  terms: Term[] = [];

  selectedTerm: Term | null = null;

  termName: string = "";
  termStartDate: Date | null = null;
  termEndDate: Date | null = null;

  editingTerm: boolean = false;

  volunteerEvents: MBEvent[] = [];

  @ViewChild('termDialog') termDialog!: TemplateRef<any>;
  termDialogRef!: MatDialogRef<any>;

  @ViewChild('termForm') termForm!: NgForm;

  @ViewChild(EventsTableComponent) eventsTable!: EventsTableComponent;

  @ViewChild(MembersTableComponent) membersTable!: MembersTableComponent;

  constructor(private adminService: AdminService,
              private eventService: EventService,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog,
              private router: Router,
              private snackbar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.eventService.getVolunteerEvents().subscribe(events => {
      this.volunteerEvents.push(...events);
    })

    this.adminService.getTerms().subscribe(terms => {
      this.terms.push(...terms);

      const currentTerm = this.sessionCacheService.get(Constants.STORAGE_KEY_TERM);
      this.selectedTerm = this.terms.find(term => term.termId == currentTerm.termId) ?? null;

      if (this.selectedTerm) {
        this.onTermChange(this.selectedTerm);
      }
    })
  }

  onTermChange(term: Term) {
    this.selectedTerm = term;
    this.eventsTable.onTermChange(term.termId);
    this.membersTable.onTermChange(term.termId);
  }


  openTermDialog(editing: boolean) {
    this.editingTerm = editing;
    if (editing) {
      this.termName = this.selectedTerm?.termName ?? '';
      this.termStartDate = this.selectedTerm?.startDate ? new Date(this.selectedTerm?.startDate) : null;
      this.termEndDate = this.selectedTerm?.endDate ? new Date(this.selectedTerm?.endDate) : null;
    }
    this.termDialogRef = this.dialog.open(this.termDialog);
  }

  cancelDialog() {
    setTimeout(() => {
      this.termForm?.reset();
    });
    this.dialog.closeAll();
  }

  submitTerm(form: NgForm) {
    let newTerm = {
      termId: this.editingTerm ? this.selectedTerm?.termId : -1, // will get assigned when the backend puts it in the database
      termName: form.value.termName,
      startDate: form.value.termStartDate,
      endDate: form.value.termEndDate
    } as Term;

    if (this.editingTerm) {
      this.adminService.updateTerm(newTerm).subscribe(() => {
        if (this.selectedTerm) {
          this.selectedTerm.termName = newTerm.termName;
          this.selectedTerm.startDate = new Date(newTerm.startDate);
          this.selectedTerm.endDate = new Date(newTerm.endDate);
        }
        this.openSnackBar("Term updated!", "Ok", 3000);
        this.termDialogRef.close();
      }, error => {
        console.log(error);
        this.openSnackBar("Error updating Term", "Ok", 3000);
      })
    }
    else {
      this.adminService.createTerm(newTerm).subscribe(() => {
        this.terms.push(newTerm);
        this.openSnackBar("Term created!", "Ok", 3000);
        this.termDialogRef.close();
      }, error => {
        console.log(error);
        this.openSnackBar("Error creating Term", "Ok", 3000);
      })
    }
  }

  // goToAttendance() {
  //   this.router.navigate(['/attendance/term', this.selectedTerm?.termId])
  // }

  goToVolunteerRoster(eventId: number) {
    this.router.navigate(['/event', eventId, 'roster'], {queryParams: {returnTo: 'admin'}})
  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
