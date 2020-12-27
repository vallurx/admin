import useSWR from 'swr';
import { ScheduleBlock, VaccineBatch } from '../../types/vaccine';

const useVaccineList = () => {
    const { data, error, mutate } = useSWR<VaccineBatch[]>(`/api/facilities/1/vaccine_shipments`);

    return {
        vaccines: data,
        error,
        mutate,
        loading: !data && !error
    };
};

const useVaccine = (batchId: number) => {
    const { data, error, mutate } = useSWR<VaccineBatch>(`/api/facilities/1/vaccine_shipments/${batchId}`);

    return {
        vaccine: data,
        error,
        mutate,
        loading: !data && !error
    };
};

const useScheduleBlocks = (batchId: number) => {
    const { data, error, mutate } = useSWR<ScheduleBlock[]>(`/api/facilities/1/vaccine_shipments/${batchId}/schedule_blocks`);

    return {
        scheduleBlocks: data,
        error,
        mutate,
        loading: !data && !error
    };
}

export { useVaccineList, useVaccine, useScheduleBlocks };