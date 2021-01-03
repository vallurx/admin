import React from 'react';
import { Steps } from 'antd';
import { ApplicationStatus } from '../../lib/types';

interface ApplicationStatusProps {
    status: ApplicationStatus;
}

const ApplicationStatusUI = (props: ApplicationStatusProps) => {
    const { status } = props;

    const getStepFromStatus = (status: ApplicationStatus): number => {
        switch (status) {
            case 'AwaitingApproval':
                return 0;
            case 'InformationNeeded':
                return 1;
            case 'Rejected':
                return 1;
            case 'Scheduling':
                return 1;
            case 'Scheduled':
                return 2;
            case 'Vaccinated':
                return 3;
        }
    };

    return (
        <Steps current={getStepFromStatus(status)}>
            <Steps.Step title="Awaiting Approval" />
            {status === 'Rejected' && (
                <Steps.Step status="error" title="Rejected" />
            )}
            {status === 'InformationNeeded' && (
                <Steps.Step status="process" title="Information Needed" />
            )}
            <Steps.Step title="Scheduling" />
            <Steps.Step title="Scheduled" />
            <Steps.Step title="Vaccinated" />
        </Steps>
    );
}

export default ApplicationStatusUI;