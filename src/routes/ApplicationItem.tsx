import React from 'react';
import { useApplication } from '../lib/data/use-application';
import { useParams } from 'react-router';
import { Skeleton, Typography } from 'antd';
import VaccineApplicationUI from '../components/VaccineApplicationUI';

const ApplicationItem = () => {
    const { id } = useParams<{ id: string }>();
    const { application } = useApplication(parseInt(id));

    if (!application) {
        return <Skeleton active />;
    }

    return (
        <>
            <Typography.Title>Application Review</Typography.Title>

            <VaccineApplicationUI application={application} />
        </>
    )
};

export default ApplicationItem;