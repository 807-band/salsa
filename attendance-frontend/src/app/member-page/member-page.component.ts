import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Member} from '../models/member';
import {MemberService} from '../services/member.service';
import {MatIcon} from '@angular/material/icon';
import {FormsModule, NgForm} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {MemberAttendanceTableComponent} from './member-attendance-table/member-attendance-table.component';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {Section} from '../models/section';
import {PepBand} from '../models/pep-band';
import {Constants} from '../utilities/constants';
import {SessionCacheService} from '../services/session-cache.service';
import {Utilities} from '../utilities/utilities';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogActions, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {BaseComponent} from '../base-component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-member-page',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    MemberAttendanceTableComponent,
    MatButton,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    MatDialogActions,
    MatDialogTitle,
    RouterLink,
    MatProgressSpinner,
  ],
  templateUrl: './member-page.component.html',
  styleUrl: './member-page.component.css'
})
export class MemberPageComponent extends BaseComponent implements OnInit {

  private _snackBar = inject(MatSnackBar);

  member: Member | null = null;
  memberLoaded: boolean = false;

  memberId!: number

  editing: boolean = false;

  sectionOptions: Section[] = [];
  pepBandOptions: PepBand[] = [];
  rehearsalConflictOptions: string[] = Utilities.getRehearsalConflictOptions();

  section: Section | null = null;
  rehearsalConflict: string | null = null;
  pepBand: PepBand | null = null;

  returnToPage: string = 'section';

  @ViewChild('confirmDeleteDialog') confirmDeleteDialog!: TemplateRef<any>;
  confirmDeleteDialogRef!: MatDialogRef<any>;

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;
  successDialogRef!: MatDialogRef<any>;

  constructor(private route: ActivatedRoute,
              private memberService: MemberService,
              private router: Router,
              public sessionCacheService: SessionCacheService,
              private dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.memberId = Number(this.route.snapshot.paramMap.get('id'));

    this.returnToPage = this.route.snapshot.queryParams['returnTo'] ?? 'section';

    this.pepBandOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_PEP_BANDS);

    this.sectionOptions = this.sessionCacheService.get(Constants.STORAGE_KEY_SECTIONS);

    this.memberService.getMemberById(this.memberId).subscribe(member => {
      this.member = member;
      this.memberLoaded = true;
    })
  }

  edit() {
    this.section = this.sectionOptions.find(s => s.sectionId == this.member?.section?.sectionId) ?? null;
    this.rehearsalConflict = this.member?.rehearsalConflict ?? null;
    this.pepBand = this.pepBandOptions.find(b => b.bandId == this.member?.pepBand?.bandId) ?? null;

    this.editing = true;
  }

  save(form: NgForm) {
    if (!this.member) {
      return;
    }
    let member = {
      memberId: this.member?.memberId,
      user: this.member?.user,
      section: form.value.section,
      pepBand: form.value.pepBand,
      rehearsalConflict: form.value.rehearsalConflict,
      term: this.member?.term
    } as Member

    this.memberService.updateMember(member).subscribe(updatedMember => {
      this.member = member;
      this.openSnackBar("Member updated!", "Ok", 3000);
      this.editing = false;
    }, error => {
      console.log(error);
      this.openSnackBar("Error updating member", "Ok", 3000);
    })
  }

  cancel() {
    this.editing = false;
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

  deleteMember() {
    if (!this.member) {
      return;
    }
    this.cancelDialog();
    this.memberService.deleteMember(this.member).subscribe(() => {
      this.openSuccessDialog();
    }, error => {
      console.log(error);
      this.openSnackBar("Error deleting member", "Ok", 3000);
    })
  }

  goBack() {
    this.cancelDialog();
    if (this.returnToPage == 'section') {
      this.router.navigate(['/section', this.member?.section?.sectionId]);
    } else if (this.returnToPage == 'attendance') {
      this.router.navigate(['/admin/attendance']);
    } else if (this.returnToPage == 'term') {
      this.router.navigate(['/admin/term']);
    }
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {duration: duration, horizontalPosition: 'center', verticalPosition: 'top'});
  }

}
