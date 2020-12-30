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
    const [dobFilter, setDOBFilter] = useState('');
    const { loading, applicationList } = useApplicationList(currentPage, 10, {
        status: statusFilter,
        name: nameFilter,
        dob: dobFilter,
    });

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleTableChange = (pagination: any, filters: any) => {
        setStatusFilter(filters.status ? filters.status.join(',') : '');
        setNameFilter(filters.name || '');
        setDOBFilter(filters.dob || '');
    };

    const columns: ColumnsType<ApplicationListItem> = [
        {
            title: 'Full Name',
            render: (value, record) => {
                const mi = record.middle_initial ? ` ${record.middle_initial} ` : ' ';
                return `${record.first_name}${mi}${record.last_name}`;
            },
            key: 'full_name',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                let value = (selectedKeys[0] as string)?.trim() || '';
                return (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search Name`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => (value.length > 0 ? confirm() : clearFilters && clearFilters(), setNameFilter(value))}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => (value.length > 0 ? confirm() : clearFilters && clearFilters(), setNameFilter(value))}
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
                </div>);
            },
            filtered: nameFilter.length > 0,
        },
        {
            title: 'Date of Birth',
            dataIndex: 'date_of_birth',
            key: 'date_of_birth',
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
                let value = (selectedKeys[0] as string)?.trim() || '';
                return (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`MM/DD/YYYY`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => (value.length > 0 ? confirm() : clearFilters && clearFilters(), setDOBFilter(value))}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => (value.length > 0 ? confirm() : clearFilters && clearFilters(), setDOBFilter(value))}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => {
                            setDOBFilter('');
                            clearFilters && clearFilters();
                        }} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                    </Space>
                </div>);
            },
            filtered: dobFilter.length > 0,
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
                { text: 'Scheduled', value: 'Scheduled' },
                { text: 'Information Needed', value: 'InformationNeeded' },
                { text: 'Scheduling', value: 'Scheduling' },
                { text: 'Awaiting Approval', value: 'AwaitingApproval' },
                { text: 'Vaccinated', value: 'Vaccinated' },
                { text: 'Rejected', value: 'Rejected' },
            ]
        },
        {
            title: 'Actions',
            render: (value, record) => {
                return (
                <Link to={'/applications/' + record.id}>
                    <Button type="primary">View Application</Button>
                </Link>
                );
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