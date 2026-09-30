import {Component, OnInit} from '@angular/core';
import {EventComponent} from './event/event.component';
import {NgForOf, NgIf} from '@angular/common';
import {MBEvent} from '../models/mb-event';
import {EventService} from '../services/event.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    EventComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {

  eventList: MBEvent[] = [];

  listType: string = 'upcoming';

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.listType = params['type'] || 'upcoming';

      if (this.listType === 'upcoming') {
        this.eventService.getUpcomingEvents().subscribe(events => {
          this.eventList = events;
        })
      } else if (this.listType === 'recent') {
        this.eventService.getRecentEvents().subscribe(events => {
          this.eventList = events;
        })
      } else if (this.listType === 'volunteer') {
        this.eventService.getVolunteerEvents().subscribe(events => {
          this.eventList = events;
        })
      }
    })
  }

  navigateToForm(eventId: number) {
    this.router.navigate(['/attendance-form', eventId], { queryParams: { fromList: this.listType } });
  }
}
