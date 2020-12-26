import useSWR from 'swr';
import { Approval, ApprovalListResults, Facility } from '../../types';

const useApprovalList = (currentPage = 1, count = 10) => {
    const { data: facilitiesList, error: facilitiesError } = useSWR<Facility[]>('/api/facilities');
    const { data, error, mutate } = useSWR<ApprovalListResults>(
        () => facilitiesList ? `/api/facilities/${facilitiesList[0].id}/approval?skip=${(currentPage - 1) * count}&count=${count}` : null
    );

    return {
        approvalList: data,
        error,
        loading: !data && !error && !facilitiesList && !facilitiesError,
        mutate
    };
};

const useApproval = (applicationId: number) => {
    const { data: facilitiesList, error: facilitiesError } = useSWR<Facility[]>('/api/facilities');
    const { data, error, mutate } = useSWR<Approval>(
        () => facilitiesList ? `/api/facilities/${facilitiesList[0].id}/approval/${applicationId}` : null
    );

    return {
        approval: data,
        error,
        loading: !data && !error && !facilitiesList && !facilitiesError,
        mutate
    };
}

const useQueuedApproval = () => {
    const { data: facilitiesList, error: facilitiesError } = useSWR<Facility[]>('/api/facilities');
    const { data: approvalList, error: approvalError, mutate: mutateList } = useSWR<ApprovalListResults>(
        () => facilitiesList ? `/api/facilities/${facilitiesList[0].id}/approval?skip=0&count=1` : null
    );

    const { data, error, mutate } = useSWR<Approval>(
        () => facilitiesList && approvalList ? `/api/facilities/${facilitiesList[0].id}/approval/${approvalList.items[0].id}` : null
    );

    return {
        approval: data,
        endOfQueue: approvalList && approvalList.items.length === 0,
        error,
        loading: !data && !error && !facilitiesList && !facilitiesError && !approvalList && !approvalError,
        mutate,
        mutateList,
        params: {
            facilityId: facilitiesList && facilitiesList[0].id
        }
    };
};

export { useApprovalList, useApproval, useQueuedApproval };