export interface Vaccine {
    id: number;
    name: string;
    description: string;
    fact_sheet: string;
    cpt_code: string;
    cvx_code: string;
    manufacturer_id: number;
    shorthand: string;
}

export interface VaccineBatch {
    id: number;
    created_at: number;
    vaccine_count: number;
    facility_id: number;
    lot_number: string;
    vaccine_id: number;
    name: string;
}

export interface ScheduleBlock {
    id: number;
    created_at: number;
    start_at: number;
    end_at: number;
    slots: number;
    vaccine_batch_id: number;
}