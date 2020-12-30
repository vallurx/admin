import {
    Result,
    Typography
} from 'antd';
import React, { useState } from 'react';
import { useQueuedApplication } from '../lib/data/use-application';
import VaccineAdminUI from '../components/VaccineAdminUI';

type AppStatus = 'Scheduling' | 'Rejected' | 'AwaitingApproval' | 'InformationNeeded';

const ApplicationQueue = () => {
    const [appStatus, setAppStatus] = useState<AppStatus>('AwaitingApproval');
    const [appNotes, setAppNotes] = useState('');
    const { application, mutateList, endOfQueue } = useQueuedApplication();

    if (endOfQueue) {
        return (
            <Result status="success" title="You have reached the end of the queue!" />
        );
    }

    return (
        <>
            <Typography.Title level={2}>Application Queue</Typography.Title>

            <VaccineAdminUI application_id={application?.id || 0} onEdit={async () => { await mutateList(); }} />
        </>
    );
};

export default ApplicationQueue;