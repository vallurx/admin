import React, { useState } from 'react';
import { ApplicationListItem } from '../types';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Button, Input, Space, Table, Typography } from 'antd';
import { useApplicationList } from '../lib/data/use-application';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const ApplicationList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const { loading, applicationList } = useApplicationList(currentPage, 10, {
        status: statusFilter,
        name: nameFilter
    });

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleTableChange = (pagination: any, filters: any) => {
        setStatusFilter(filters.status ? filters.status.join(',') : '');
        setNameFilter(filters.name || '');
    };

    const columns: ColumnsType<ApplicationListItem> = [
        {
            title: 'Full Name',
            render: (value, record) => {
                const mi = record.middle_initial ? ` ${record.middle_initial} ` : ' ';
                return `${record.first_name}${mi}${record.last_name}`;
            },
            key: 'full_name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search Name`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => setNameFilter(selectedKeys[0] as string)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => setNameFilter(selectedKeys[0] as string)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => {
                            setNameFilter('');
                            clearFilters && clearFilters();
                        }} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>
            )
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
            title: 'Requested On',
            render: (value, record) => {
                return dayjs(record.created_at).format('LLL')
            },
            key: 'requestedAt'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Awaiting Approval', value: 'AwaitingApproval' },
                { text: 'Scheduling', value: 'Scheduling' },
                { text: 'Scheduled', value: 'Scheduled' },
                { text: 'Vaccinated', value: 'Vaccinated' }
            ]
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
            <Typography.Title level={2}>Vaccine Applications</Typography.Title>

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
                onChange={handleTableChange}
            />
        </>
    );
};

export default ApplicationList;