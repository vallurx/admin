import useSWR from 'swr';
import { Patient } from '../types';

export const usePatient = (patientId: number | undefined) => {
    const { data, error, mutate } = useSWR<Patient>(() => patientId ? '/api/admin/patients/' + patientId : null);

    return {
        patient: data,
        error,
        mutate
    };
};

export const usePatientList = () => {
    const { data, error, mutate } = useSWR<Patient>('/api/admin/patients');

    return {
        patients: data,
        error,
        mutate
    };
};

export const usePatientApplications = (patientId: number) => {
    const { data, error, mutate } = useSWR<Patient>('/api/admin/patients/' + patientId + '/applications');

    return {
        applications: data,
        error,
        mutate
    };
};