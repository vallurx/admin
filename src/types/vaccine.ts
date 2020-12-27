import { manufacturers } from '../lib/manufacturers';

export interface VaccineBatch {
    id: number,
    created_at: number,
    vaccine_count: number,
    manufacturer: keyof typeof manufacturers,
    facility_id: number,
    name: string,
}

export interface ScheduleBlock {
    id: number;
    created_at: number;
    start_at: number;
    end_at: number;
    slots: number;
    vaccine_batch_id: number;
}