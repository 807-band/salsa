import {db} from "../data-source";
import {EventAttendance} from "../entities/event-attendance.entity";
import {plainToInstance} from "class-transformer";
import {MemberStatsDto} from "../dto/member-stats.dto";
import {AttendanceTermPageDto} from "../dto/attendance-term-page.dto";
import {InsertResult, IsNull, Not} from "typeorm";
import {Constants} from "../utilities/constants";

export class AttendanceRepository {
    private repo = db.getRepository(EventAttendance);

    public async findById(id: number): Promise<EventAttendance | null> {
        return await this.repo.findOne({ where: { attendanceId: id },
            relations: {
                mbEvent: true,
                member: {
                    term: true
                },
                sub: true,
                section: true,
            }
        });
    }

    // used when deleting a member and all their attendances - skips fetching the event/member/sub fields
    public async findByMemberIdConcise(id: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: { member: { memberId: id } },
        });
    }

    public async findByMemberId(id: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: [
                {
                    member: { memberId: id },
                    attendance: Not('Sub')
                },
                {
                    member: { memberId: id },
                    attendance: IsNull()
                },
                {
                    sub: { memberId: id }
                }
            ],
            relations: {
                // since we're fetching by the member id, we presumably already have the member object
                mbEvent: {
                    pepBand: true
                },
                sub: true,
                section: true,
            },
            order: {
                mbEvent: {
                    date: 'DESC'
                }
            }
        });
    }

    public async findBySectionAndEventId(sectionId: number, eventId: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: {
                section: { sectionId },
                mbEvent: { eventId }
            },
            relations: {
                mbEvent: true,
                member: true,
                sub: true,
                section: true,
            }
        });
    }

    public async getByTermIdAndSection(
            termId: number,
            sectionId: number | null,
            eventType: string): Promise<AttendanceTermPageDto[]> {

        const params: any[] = [termId, eventType];
        let sectionClause = '';

        if (sectionId !== null) {
            sectionClause = 'AND ea.sectionId = ?';
            params.push(sectionId);
        }

        const sql = `
              SELECT
                ea.attendanceId,
                ea.attendance AS attendanceStatus,
                e.eventId,
                e.title AS eventTitle,
                e.date AS eventDate,
                mem.memberId,
                u.firstName AS memberFirstName,
                u.lastName AS memberLastName,
                mem.rehearsalConflict,
                sub.memberId AS subId,
                sub_u.firstName AS subFirstName,
                sub_u.lastName AS subLastName,
                s.sectionId,
                s.name AS sectionName
              FROM EventAttendance ea
              JOIN MBEvent e ON ea.eventId = e.eventId
              JOIN Member mem ON ea.memberId = mem.memberId
              JOIN User u ON mem.email = u.email
              LEFT JOIN Member sub ON ea.subId = sub.memberId
              LEFT JOIN User sub_u ON sub.email = sub_u.email
              JOIN Section s ON mem.sectionId = s.sectionId
              WHERE e.termId = ?
                AND e.type = ?
                AND mem.memberId IS NOT NULL
                ${sectionClause}
              ORDER BY s.sectionId, e.date, u.lastName
        `;

        const results: any[] = await db.query(sql, params);

        return plainToInstance(AttendanceTermPageDto, results, {
            excludeExtraneousValues: true,
        });
    }

    public async getByTermIdAndSectionAndPepBand(
            termId: number,
            pepBandId: string,
            sectionId: number | null,
            ignoreMemberPepBand: boolean): Promise<AttendanceTermPageDto[]> {
        const params: any[] = [termId, pepBandId];
        let pepBandClause = '';
        let sectionClause = '';

        if (!ignoreMemberPepBand && pepBandId != Constants.PEP_BAND_ID_VOLUNTEER) {
            pepBandClause = 'AND mem.pepBandId = ? ';
            params.push(pepBandId);
        }

        if (sectionId !== null) {
            sectionClause = 'AND ea.sectionId = ? ';
            params.push(sectionId);
        }

        const sql = `
            SELECT
              ea.attendanceId,
              ea.attendance AS attendanceStatus,
              e.eventId,
              e.title AS eventTitle,
              e.date AS eventDate,
              mem.memberId,
              u.firstName AS memberFirstName,
              u.lastName AS memberLastName,
              mem.rehearsalConflict,
              sub.memberId AS subId,
              sub_u.firstName AS subFirstName,
              sub_u.lastName AS subLastName,
              s.sectionId,
              s.name AS sectionName
            FROM EventAttendance ea
            LEFT JOIN MBEvent e ON ea.eventId = e.eventId
            LEFT JOIN Member mem ON ea.memberId = mem.memberId
            LEFT JOIN User u ON mem.email = u.email
            LEFT JOIN Member sub ON ea.subId = sub.memberId
            LEFT JOIN User sub_u ON sub.email = sub_u.email
            LEFT JOIN Section s ON mem.sectionId = s.sectionId
            WHERE e.termId = ?
              AND e.pepBandId = ?
              AND mem.memberId IS NOT NULL
              ${pepBandClause}
              ${sectionClause}
            ORDER BY e.date, u.lastName
        `;

        const results: any[] = await db.query(sql, params);

        return plainToInstance(AttendanceTermPageDto, results, {
            excludeExtraneousValues: true,
        });
    }


    public async getMemberStats(termId: number, sectionId?: number): Promise<MemberStatsDto> {
        const params = [termId];

        let sectionClause = '';
        if (sectionId) {
            sectionClause = `AND m.sectionId = ?`
            params.push(sectionId);
        }

        const sql = `
            SELECT
                 m.memberId,
                 m.email,
                 u.firstName,
                 u.lastName,
                 s.sectionId,
                 s.name AS sectionName,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.attendance LIKE '%Unexcused%'
                                THEN 1 END) AS totalUnexcusedMisses,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId
                                    AND e.type = 'Rehearsal'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.attendance LIKE '%Unexcused%'
                                THEN 1 END) AS rehearsalsMissed,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId
                                    AND e.type = 'Whole Band Event'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.attendance LIKE '%Unexcused%'
                                THEN 1 END) AS wholeBandEventsMissed,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId
                                    AND e.type = 'Pep Event'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.attendance LIKE '%Unexcused%'
                                THEN 1 END) AS pepEventsMissed,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId
                                    AND e.type = 'Rehearsal'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.attendance NOT LIKE '%Absent%'
                                THEN 1 END) AS rehearsalsAttended,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId 
                                    AND e.type = 'Whole Band Event'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.attendance NOT LIKE '%Absent%'
                                THEN 1 END) AS wholeBandEventsAttended,
                 COUNT(CASE WHEN 
                                e.type = 'Pep Event'
                                     AND ea.attendance IS NOT NULL
                                     AND ea.attendance <> ''
                                     AND ea.attendance NOT LIKE '%Absent%'
                                     AND (
                                          (ea.attendance <> 'Sub' AND ea.memberId = m.memberId)
                                              OR
                                          (ea.attendance = 'Sub' AND ea.subId = m.memberId)
                                          )
                                THEN 1 END) AS totalPepEventsAttended,
                 COUNT(CASE WHEN
                                m.memberId = ea.memberId 
                                    AND e.type = 'Pep Event'
                                    AND b.bandId <> 'V'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.required = 1
                                    AND ea.attendance NOT LIKE '%Absent%'
                                    AND ea.attendance NOT LIKE '%Sub%'
                                THEN 1 END) AS assignedAbcEventsAttended,
                 COUNT(CASE WHEN
                                e.type = 'Pep Event'               
                                    AND b.bandId <> 'V'
                                    AND ea.attendance IS NOT NULL
                                    AND ea.attendance <> ''
                                    AND ea.required = 0
                                    AND ((m.memberId = ea.memberId
                                            AND ea.attendance NOT LIKE '%Absent%'
                                            AND ea.attendance NOT LIKE '%Sub%')
                                        OR (ea.subId IS NOT NULL AND m.memberId = ea.subId))
                                THEN 1 END) AS extraAbcEventsAttended,
                 COUNT(CASE WHEN ea.subId = m.memberId THEN 1 END) AS abcEventsSubbed,
                 COUNT(CASE WHEN
                                b.bandId = 'V'
                                   AND ea.attendance IS NOT NULL
                                   AND ea.attendance <> ''
                                   AND ((m.memberId = ea.memberId
                                             AND ea.attendance NOT LIKE '%Absent%'
                                             AND ea.attendance NOT LIKE '%Sub%')
                                        OR (ea.subId IS NOT NULL AND m.memberId = ea.subId)) 
                                   THEN 1 END) AS volunteerEventsAttended
             FROM Member m
                      LEFT JOIN User u ON m.email = u.email
                      LEFT JOIN Section s on m.sectionId = s.sectionId
                      LEFT JOIN EventAttendance ea ON (m.memberId = ea.memberId OR m.memberId = ea.subId)
                      LEFT JOIN MBEvent e ON ea.eventId = e.eventId
                      LEFT JOIN PepBand b ON e.pepBandId = b.bandId
                      LEFT JOIN Term t ON m.termId = t.termId
             WHERE t.termId = ?
               ${sectionClause}
             GROUP BY m.memberId
             ORDER BY s.sectionId, u.lastName
             `;

        const results = await db.query(sql, params);

        const stats = plainToInstance(MemberStatsDto, results, {
            excludeExtraneousValues: true,
        });

        return stats;
    }

    // TODO: this will throw an error if the unique (memberId, eventId) constraint is violated.
    //  It shouldn't happen but still handle gracefully!!
    // Use this when saving a new blank attendance row that has just been added in the frontend, or when
    // updating an existing attendance
    public async save(attendance: Partial<EventAttendance>): Promise<EventAttendance> {
        return this.repo.save(attendance);
    }

    // Use this when creating a new attendance to be assigned to a member (like when a new member or event is added)
    // If a duplicate entry is added (i.e. an entry already exists for that member and event) it will just be ignored
    public async create(attendance: Partial<EventAttendance>) {
        await this.repo
            .createQueryBuilder()
            .insert()
            .values(attendance)
            .orUpdate(['attendanceId'], ['memberId', 'eventId'])
            .execute();
    }

    public async delete(attendanceId: number): Promise<void> {
        await this.repo.delete(attendanceId);
    }

    public async findByEventId(eventId: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: {
                mbEvent: { eventId }
            }
        });
    }

    public async deleteAttendancesForEvent(eventId: number): Promise<void> {
        const attendances = await this.findByEventId(eventId);

        attendances.forEach(att => this.delete(att.attendanceId));
    }

    public async deleteAttendancesForMember(memberId: number): Promise<void> {
        const attendances = await this.findByMemberIdConcise(memberId);

        attendances.forEach(att => this.delete(att.attendanceId));
    }

    public async findEmptyByMemberAndPepBandId(id: number, pepBandId: string): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: {
                member: { memberId: id },
                mbEvent: {
                    pepBand: { bandId: pepBandId }
                },
                attendance: IsNull()
            }
        });
    }

    // used when changing pep attendances to not required
    public async findPepEventsByMemberId(id: number): Promise<EventAttendance[]> {
        return await this.repo.find({
            where: {
                member: { memberId: id },
                mbEvent: {
                    type: Constants.EVENT_TYPE_PEP_EVENT,
                    pepBand: {
                        bandId: Not(Constants.PEP_BAND_ID_VOLUNTEER)
                    }
                }
            },
            relations: {
                mbEvent: true
            }
        });
    }

    public async deleteEmptyPepAttendancesForMember(memberId: number, pepBandId: string): Promise<void> {
        const attendances = await this.findEmptyByMemberAndPepBandId(memberId, pepBandId);

        attendances.forEach(att => this.delete(att.attendanceId));
    }

    public async updateEmptyAttendancesSectionForMember(memberId: number): Promise<void> {
        await this.repo
            .createQueryBuilder()
            .update(EventAttendance)
            .set({
                section: () => `
                (SELECT m.sectionId 
                 FROM Member m 
                 WHERE m.memberId = EventAttendance.memberId)
            `
            })
            .where("EventAttendance.memberId = :memberId", { memberId })
            .andWhere("(EventAttendance.attendance IS NULL OR EventAttendance.attendance = '')")
            .execute();
    }

}