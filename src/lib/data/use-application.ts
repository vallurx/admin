import useSWR from 'swr';
import { Application, ApplicationListResults, ScheduleBlockApplication } from '../../types';

interface AppFilters {
    status: string;
    name: string;
}

const defaultFilters = {
    status: '',
    name: ''
}

const useApplicationList = (currentPage = 1, count = 10, filters: AppFilters = defaultFilters) => {
    const filterStr = `skip=${(currentPage - 1) * count}&count=${count}&status=${filters.status || '*'}&filter_name=${filters.name || ''}`;
    const { data, error, mutate } = useSWR<ApplicationListResults>(`/api/facilities/1/application?${filterStr}`);

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
    const { data, error, mutate } = useSWR<Application>(`/api/facilities/1/application/${applicationId}`);

    return {
        application: data,
        error,
        loading: !data && !error,
        mutate
    };
}

const useQueuedApplication = () => {
    const { data: applicationList, error: applicationError, mutate: mutateList } = useSWR<ApplicationListResults>(`/api/facilities/1/application?skip=0&count=1`);
    const { data, error, mutate } = useSWR<Application>(
        () => applicationList ? `/api/facilities/1/application/${applicationList.items[0].id}` : null
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