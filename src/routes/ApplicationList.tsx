import React, { useState } from 'react';
import { ApplicationListItem } from '../types';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Button, Table, Typography } from 'antd';
import { useApplicationList } from '../lib/data/use-application';
import { Link } from 'react-router-dom';

const ApplicationList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { error, loading, applicationList } = useApplicationList();

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const columns: ColumnsType<ApplicationListItem> = [
        {
            title: 'Full Name',
            render: (value, record) => {
                const mi = record.middle_initial ? ` ${record.middle_initial} ` : ' ';
                return `${record.first_name}${mi}${record.last_name}`;
            },
            key: 'full_name'
        },
        {
            title: 'Date of Birth',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth'
        },
        {
            title: 'Employer',
            dataIndex: 'employer',
            key: 'employer'
        },
        {
            title: 'Requested At',
            render: (value, record) => {
                return dayjs(record.created_at).format('LLL')
            },
            key: 'requestedAt'
        },
        {
            title: 'Actions',
            render: (value, record) => {
                return (
                    <Link to={'/applications/' + record.id}>
                        <Button type="primary">View Application</Button>
                    </Link>
                )
            },
            key: 'actions'
        }
    ];

    return (
        <>
            <Typography.Title level={2}>Vaccine Application Queue</Typography.Title>

            <Table
                columns={columns}
                dataSource={applicationList?.items}
                pagination={{
                    pageSize: 10,
                    current: currentPage,
                    total: applicationList?.total,
                    onChange: onPageChange
                }}
                rowKey="id"
                loading={loading}
            />
        </>
    );
};

export default ApplicationList;