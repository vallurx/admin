import React, { useState } from 'react';
import { ApprovalListItem } from '../types';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Button, Table, Typography } from 'antd';
import { useApprovalList } from '../lib/data/use-approval';

const ApprovalList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { error, loading, approvalList } = useApprovalList();

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const columns: ColumnsType<ApprovalListItem> = [
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
                return dayjs(record.created_at).utc(true).local().format('LLL')
            },
            key: 'requestedAt'
        },
        {
            title: 'Actions',
            render: (value, record) => {
                return <Button type="link">Review</Button>
            },
            key: 'actions'
        }
    ];

    return (
        <>
            <Typography.Title level={2}>Vaccine Application Queue</Typography.Title>

            <Table
                columns={columns}
                dataSource={approvalList?.items}
                pagination={{
                    pageSize: 10,
                    current: currentPage,
                    total: approvalList?.total,
                    onChange: onPageChange
                }}
                rowKey="id"
                loading={loading}
            />
        </>
    );
};

export default ApprovalList;