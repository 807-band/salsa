import {db} from "../data-source";
import {MBEvent} from "../entities/mb-event.entity";
import {IsNull, LessThan, MoreThanOrEqual, Not} from "typeorm";
import {NotFoundError} from "../errors/not-found-error";
import {Constants} from "../utilities/constants";

export class MbEventRepository {
    private repo = db.getRepository(MBEvent);

    public async findById(id: number): Promise<MBEvent> {
        const mbEvent = await this.repo.findOne({ where: { eventId: id },
            relations: {
                term: true,
                pepBand: true,
                volunteerRosterMemberCounts: true
            }
        });

        if (!mbEvent) {
            throw new NotFoundError('Event not found');
        }

        return mbEvent;
    }

    public async getUpcomingOrRecent(upcoming: boolean): Promise<MBEvent[]> {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        return this.repo.find({
            where: {
                date: upcoming ? MoreThanOrEqual(oneHourAgo) : LessThan(oneHourAgo),
                term: {
                    startDate: LessThan(new Date()),
                    endDate: MoreThanOrEqual(new Date()),
                },
            },
            relations: {
                term: true,
                pepBand: true,
            },
            order: {
                date: upcoming ? 'ASC' : 'DESC',
            },
        });
    }

    public async getVolunteer(): Promise<MBEvent[]> {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        return this.repo.find({
            where: {
                date: MoreThanOrEqual(oneHourAgo),
                term: {
                    startDate: LessThan(new Date()),
                    endDate: MoreThanOrEqual(new Date()),
                },
                pepBand: {
                    bandId: Constants.PEP_BAND_ID_VOLUNTEER
                }
            },
            relations: {
                term: true,
                pepBand: true
            },
            order: {
                date: 'ASC',
            },
        });
    }

    public async getByTermId(termId: number): Promise<MBEvent[]> {
        return this.repo.find({
            where: { term: { termId } },
            relations: {
                term: true,
                pepBand: true,
            },
            order: {
                date: 'DESC',
            },
        });
    }

    public async getNonPepEventsByTermId(termId: number): Promise<MBEvent[]> {
        return this.repo.find({
            where: {
                term: { termId },
                type: Not(Constants.EVENT_TYPE_PEP_EVENT)
            },
            relations: {
                term: true,
                pepBand: true,
            },
            order: {
                date: 'DESC',
            },
        });
    }

    public async getByTermAndPepBandId(termId: number, bandId: string | null): Promise<MBEvent[]> {
        const where = [{ term: { termId }, pepBand: IsNull() as any }];
        if (bandId) {
            where.push({ term: { termId }, pepBand: { bandId } });
        }

        return this.repo.find({ where });
    }

    public async getABCEventsOnlyByTermId(termId: number, bandId: string): Promise<MBEvent[]> {
        return this.repo.find({
            where: {
                term: { termId },
                pepBand: { bandId }
            } });
    }

    public async save(mbEvent: Partial<MBEvent>): Promise<MBEvent> {
        return await this.repo.save(mbEvent);
    }

    public async delete(eventId: number): Promise<void> {
        await this.repo.delete(eventId);
    }

}