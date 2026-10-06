import {Component, Input} from '@angular/core';
import {DatePipe, NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MBEvent} from '../../../models/mb-event';

@Component({
  selector: 'app-volunteer-event-card',
  standalone: true,
  imports: [
    DatePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatIcon,
    NgIf,
  ],
  templateUrl: './volunteer-event-card.component.html',
  styleUrl: './volunteer-event-card.component.css'
})
export class VolunteerEventCardComponent {
  @Input()
  event: MBEvent | null = null;

  @Input()
  isMobile: boolean = false;
}
