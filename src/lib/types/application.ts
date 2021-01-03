export type ApplicationStatus = 'AwaitingApproval' | 'Scheduling' | 'Scheduled' | 'Vaccinated' | 'InformationNeeded' | 'Rejected';

export interface ApplicationListItem {
    id: number;
    created_at: number;
    first_name: string;
    middle_initial: string;
    last_name: string;
    date_of_birth: string;
    employer: string;
    status: ApplicationStatus;
}

export interface ApplicationListResults {
    items: ApplicationListItem[];
    total: number;
}

export interface Application {
    id: number;
    created_at: number;
    facility_id: number;
    vaccine_batch_id?: number;
    schedule_block_id?: number;
    vaccine_id: number;
    vaccine_dose_id: number;
    patient_id: number;
    guardian_name: string;
    signature_typed: string;
    signature_date: string;
    signature_print: string;
    signature_relationship: string;
    target_populations?: string;
    screening_questions: ScreeningQuestion[];
    work_id_image_url: string;
    notes: string;
    status: ApplicationStatus;
    results?: ApplicationResults;
}

export interface ApplicationResults {
    administered_at: number;
    anatomical_route: string;
    anatomical_site: string;
    dose_size: string;
    signature_url: string;
}

export interface ScreeningQuestion {
    id: number;
    question: string;
    answer: boolean;
    details: string;
}

export interface ScheduleBlockApplication {
    id: number;
    created_at: number;
    first_name: string;
    middle_initial: string;
    last_name: string;
    suffix: string;
    date_of_birth: string;
    phone_number: string;
    status: ApplicationStatus;
}