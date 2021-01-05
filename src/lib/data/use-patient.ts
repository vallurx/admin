import useSWR from 'swr';
import { ApplicationListItem, Patient, PatientListResponse } from '../types';
import { AppFilters } from './use-application';
import { generateQuery } from '../util';

export interface PatientFilters {
    filter_name?: string;
    filter_dob?: string;
    filter_phone?: string;
}

const defaultFilters: PatientFilters = {
    filter_name: '',
    filter_dob: '',
    filter_phone: ''
}

export const usePatient = (patientId: number | undefined) => {
    const { data, error, mutate } = useSWR<Patient>(() => patientId ? '/api/admin/patients/' + patientId : null);

    return {
        patient: data,
        error,
        mutate
    };
};

export const usePatientList = (currentPage = 1, count = 10, filters: AppFilters = defaultFilters) => {
    const query = {
        skip: count * (currentPage - 1),
        count,
        ...filters
    };

    const { data, error, mutate } = useSWR<PatientListResponse>(`/api/admin/patients${generateQuery(query)}`);

    return {
        patients: data,
        error,
        mutate
    };
};

export const usePatientApplications = (patientId: number) => {
    const { data, error, mutate } = useSWR<ApplicationListItem[]>('/api/admin/patients/' + patientId + '/applications');

    return {
        applications: data,
        error,
        mutate
    };
};