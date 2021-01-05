import useSWR from 'swr';
import { Application, ApplicationListResults, ScheduleBlockApplication } from '../types';
import { generateQuery } from '../util';

export interface AppFilters {
    status?: string;
    filter_name?: string;
    filter_dob?: string;
    filter_phone?: string;
}

const defaultFilters: AppFilters = {
    status: '*',
    filter_name: '',
    filter_dob: '',
    filter_phone: ''
}

const useApplicationList = (currentPage = 1, count = 10, filters: AppFilters = defaultFilters) => {
    const query = {
        skip: count * (currentPage - 1),
        count,
        ...filters
    };

    const { data, error, mutate } = useSWR<ApplicationListResults>(`/api/facilities/1/applications${generateQuery(query)}`);

    return {
        applicationList: data,
        error,
        loading: !data && !error,
        mutate
    };
};

const useApplicationsByScheduleBlock = (blockId: number) => {
    const { data, error, mutate } = useSWR<ScheduleBlockApplication[]>(`/api/schedule_blocks/${blockId}/applications`);

    return {
        applications: data,
        error,
        loading: !data && !error,
        mutate
    };
};

const useApplication = (applicationId: number) => {
    const { data, error, mutate } = useSWR<Application>(`/api/applications/${applicationId}`);

    return {
        application: data,
        error,
        loading: !data && !error,
        mutate
    };
}

const useQueuedApplication = () => {
    const { data: applicationList, error: applicationError, mutate: mutateList } = useSWR<ApplicationListResults>(`/api/facilities/1/applications?skip=0&count=1&status=AwaitingApproval`);
    const { data, error, mutate } = useSWR<Application>(
        () => applicationList ? `/api/applications/${applicationList.items[0].id}` : null
    );

    return {
        application: data,
        endOfQueue: applicationList && applicationList.items.length === 0,
        error,
        loading: !data && !error && !applicationList && !applicationError,
        mutate,
        mutateList
    };
};

export { useApplicationList, useApplication, useQueuedApplication, useApplicationsByScheduleBlock };