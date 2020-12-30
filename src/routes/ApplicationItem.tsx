import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Typography } from 'antd';
import VaccineAdminUI from '../components/VaccineAdminUI';

const ApplicationItem = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <Typography.Title>Application Review</Typography.Title>

            <VaccineAdminUI application_id={parseInt(id)} />
        </>
    )
};

export default ApplicationItem;