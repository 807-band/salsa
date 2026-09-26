import {Component, Input, Output} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {EventTagComponent} from './event-tag/event-tag.component';
import {DatePipe, NgIf, NgStyle} from '@angular/common';
import {MBEvent} from '../../models/mb-event';
import {Constants} from '../../utilities/constants';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatDivider,
    MatCardContent,
    MatCardTitle,
    MatIcon,
    EventTagComponent,
    DatePipe,
    NgIf,
    NgStyle
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

  protected readonly REHEARSAL = Constants.EVENT_TYPE_REHEARSAL;

  constructor() {
  }

  @Input()
  event: MBEvent | null = null;

  protected readonly EVENT_TYPE_PEP_EVENT = Constants.EVENT_TYPE_PEP_EVENT;

}
