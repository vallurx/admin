import useSWR from 'swr';
import { ScheduleBlock, Vaccine, VaccineBatch } from '../../types/vaccine';

const useVaccineList = () => {
    const { data, error, mutate } = useSWR<Vaccine[]>(`/api/vaccines`);

    return {
        vaccines: data,
        error,
        mutate,
        loading: !data && !error
    };
};

const useVaccine = (id: number) => {
    const { data, error, mutate } = useSWR<Vaccine>(`/api/vaccines/${id}`);

    return {
        vaccine: data,
        error,
        mutate,
        loading: !data && !error
    };
};

const useVaccineShipmentList = () => {
    const { data, error, mutate } = useSWR<VaccineBatch[]>(`/api/facilities/1/vaccine_shipments`);

    return {
        vaccineShipments: data,
        error,
        mutate,
        loading: !data && !error
    };
};

const useVaccineShipment = (batchId: number) => {
    const { data, error, mutate } = useSWR<VaccineBatch>(`/api/facilities/1/vaccine_shipments/${batchId}`);

    return {
        vaccineShipment: data,
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
};

const useScheduleBlock = (blockId: number) => {
    const { data, error, mutate } = useSWR<ScheduleBlock>(`/api/schedule_blocks/${blockId}`);

    return {
        scheduleBlock: data,
        error,
        mutate,
        loading: !data && !error
    };
}

export { useVaccineList, useVaccine, useVaccineShipmentList, useVaccineShipment, useScheduleBlocks, useScheduleBlock };