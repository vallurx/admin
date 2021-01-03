import { manufacturers } from '../manufacturers';

export interface Vaccine {
    id: number;
    cpt_code: number;
    cvx_code: number;
    manufacturer: {
        id: number;
        name: string;
        mvx_code: string;
    };
    name: string;
    description: string;
    fact_sheet: string;
    shorthand: string;
    doses: VaccineDose[];
}

export interface VaccineDose {
    id: number;
    vaccine_id: number;
    administration_codes: number;
    index: number;
    index_day: number;
}

export interface VaccineBatch {
    id: number;
    created_at: number;
    vaccine_count: number;
    facility_id: number;
    lot_number: string;
    name: string;
    manufacturer: keyof typeof manufacturers;
    scheduled_vaccines: number;
    used_vaccines: number;
}

export interface ScheduleBlock {
    id: number;
    created_at: number;
    start_at: number;
    end_at: number;
    slots: number;
    vaccine_batch_id: number;
}