import {MbEventRepository} from "../repositories/mb-event.repository";
import {MBEventDto} from "../dto/mb-event.dto";
import {MBEvent} from "../entities/mb-event.entity";
import {toMbEventDto} from "../mappers/mb-event.mapper";
import {PepBandService} from "./pep-band.service";
import {Constants} from "../utilities/constants";
import {SectionService} from "./section.service";
import {Section} from "../entities/section.entity";
import {VolunteerRosterMemberCountService} from "./volunteer-roster-member-count.service";
import {AttendanceService} from "./attendance.service";
import {EventAttendance} from "../entities/event-attendance.entity";
import {VolunteerRosterMemberCount} from "../entities/volunteer-roster-member-count.entity";
import {TermRepository} from "../repositories/term.repository";


export class MbEventService {
    private eventRepository: MbEventRepository;
    private termRepository: TermRepository;
    private pepBandService: PepBandService;
    private sectionService: SectionService;
    private vrmcService: VolunteerRosterMemberCountService;
    private attendanceService: AttendanceService;

    constructor(attendanceRepository?: MbEventRepository,
                termRepository?: TermRepository,
                pepBandService?: PepBandService,
                sectionService?: SectionService,
                vrmcService?: VolunteerRosterMemberCountService,
                attendanceService?: AttendanceService) {
        this.eventRepository = attendanceRepository ?? new MbEventRepository();
        this.termRepository = termRepository ?? new TermRepository();
        this.pepBandService = pepBandService ?? new PepBandService();
        this.sectionService = sectionService ?? new SectionService();
        this.vrmcService = vrmcService ?? new VolunteerRosterMemberCountService();
        this.attendanceService = attendanceService ?? new AttendanceService();
    }

    public async getById(eventId: number): Promise<MBEvent> {
        const mbEvent: MBEvent =
            await this.eventRepository.findById(eventId);

        return mbEvent;
    }

    public async getUpcoming(): Promise<MBEventDto[]> {
        const events: MBEvent[] =
            await this.eventRepository.getUpcomingOrRecent(true);

        const eventDtos = events.map(event => toMbEventDto(event));

        return eventDtos;
    }

    public async getRecent(): Promise<MBEventDto[]> {
        const events: MBEvent[] =
            await this.eventRepository.getUpcomingOrRecent(false);

        const eventDtos = events.map(event => toMbEventDto(event));

        return eventDtos;
    }

    public async getVolunteer(): Promise<MBEventDto[]> {
        const events: MBEvent[] =
            await this.eventRepository.getVolunteer();

        const eventDtos = events.map(event => toMbEventDto(event));

        return eventDtos;
    }

    public async getByTermId(termId: number): Promise<MBEvent[]> {
        const events: MBEvent[] =
            await this.eventRepository.getByTermId(termId);

        return events;
    }

    public async create(eventDto: MBEventDto): Promise<MBEvent> {
        // save the new event and get back the generated ID
        let newEvent: MBEvent = new MBEvent();
        newEvent.type = eventDto.type;
        newEvent.extraAttendeesAllowed = eventDto.extraAttendeesAllowed;
        newEvent.title = eventDto.title;
        newEvent.date = new Date(eventDto.date);

        newEvent.term = await this.termRepository.findById(eventDto.term.termId);
        newEvent.pepBand = (eventDto.type === Constants.EVENT_TYPE_PEP_EVENT && eventDto.pepBand)
            ? await this.pepBandService.getById(eventDto.pepBand.bandId) : null;
        newEvent = await this.eventRepository.save(newEvent);

        // create blank VolunteerRosterMemberCount objects if it's a volunteer event
        if (eventDto.type == Constants.EVENT_TYPE_PEP_EVENT && eventDto.pepBand.bandId == Constants.PEP_BAND_ID_VOLUNTEER) {
            const sections: Section[] = await this.sectionService.getAll()
            for (let section of sections) {
                await this.vrmcService.create(newEvent, section, null);
            }
        }

        // create blank attendances
        await this.attendanceService.createAttendancesForEvent(newEvent);

        return newEvent;
    }

    public async update(eventDto: MBEventDto): Promise<MBEvent> {
        let existingEvent: MBEvent = await this.eventRepository.findById(eventDto.eventId);
        existingEvent.extraAttendeesAllowed = eventDto.extraAttendeesAllowed;
        existingEvent.title = eventDto.title;
        existingEvent.date = new Date(eventDto.date);
        existingEvent.type = eventDto.type;

        // if it changed to or from a pep event (or changed pep bands), reassign EventAttendances
        if (eventDto.pepBand?.bandId !== existingEvent.pepBand?.bandId) {
            // delete all existing attendances
            await this.attendanceService.deleteAttendancesForEvent(eventDto.eventId);

            existingEvent.pepBand = eventDto.pepBand ? await this.pepBandService.getById(eventDto.pepBand.bandId) : null;

            // create new attendances
            await this.attendanceService.createAttendancesForEvent(existingEvent);
        }


        existingEvent = await this.eventRepository.save(existingEvent);

        // update VolunteerRosterMemberCount objects if it's a volunteer event
        if (eventDto.type == Constants.EVENT_TYPE_PEP_EVENT && eventDto.pepBand.bandId == Constants.PEP_BAND_ID_VOLUNTEER) {
            const counts: VolunteerRosterMemberCount[] = [];

            for (let countDto of eventDto.volunteerRosterMemberCounts) {
                const existingCount: VolunteerRosterMemberCount =
                    await this.vrmcService.getBySectionAndEventId(countDto.section.sectionId, countDto.eventId);
                existingCount.numMembersNeeded = countDto.numMembersNeeded;
                await this.vrmcService.update(existingCount);
                counts.push(existingCount);
            }

            // attach the counts to the event to send back to the frontend
            existingEvent.volunteerRosterMemberCounts = counts;
        }

        return existingEvent;
    }

    public async delete(eventId: number): Promise<void> {
        // first delete all associated VolunteerRosterMemberCounts and EventAttendances
        const counts: VolunteerRosterMemberCount[] = await this.vrmcService.getByEventId(eventId);
        const attendances: EventAttendance[] = await this.attendanceService.getByEventId(eventId);

        counts.forEach(count => this.vrmcService.delete(count));
        attendances.forEach(att => this.attendanceService.delete(att.attendanceId));

        // now the event is safe to delete
        await this.eventRepository.delete(eventId);
    }
}