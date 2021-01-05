import React, { useState } from 'react';
import { ApplicationListItem } from '../lib/types';
import { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { Button, Card, Col, Form, Input, Row, Select, Table, Typography } from 'antd';
import { AppFilters, useApplicationList } from '../lib/data/use-application';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { DatePicker } from '../components/dayjs';

const ApplicationList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [tableFilters, setTableFilters] = useState<AppFilters>({
        status: '*',
        filter_name: '',
        filter_dob: '',
        filter_phone: ''
    });
    const { loading, applicationList } = useApplicationList(currentPage, 10, tableFilters);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const filterTable = (data: AppFilters & { filter_dob: Dayjs }) => {
        const dob = dayjs(data.filter_dob);

        setTableFilters({
            ...data,
            filter_dob: dob.isValid() ? dob.format('MM/DD/YYYY') : ''
        });
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
            title: 'Phone Number',
            dataIndex: 'phone_number',
            key: 'phone_number'
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
            key: 'status'
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

            <Card style={{backgroundColor: '#FAFAFA', borderBottom: 'none'}}>
                <Form
                    layout="vertical"
                    onFinish={filterTable}
                    initialValues={tableFilters}
                >
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item label="Patient Name" name="filter_name">
                                <Input allowClear />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Patient Phone" name="filter_phone">
                                <Input allowClear />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item label="Date of Birth" name="filter_dob">
                                <DatePicker style={{width: '100%'}} format="MM/DD/YYYY" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Application Status" name="status">
                                <Select>
                                    <Select.Option value="*">All</Select.Option>
                                    <Select.Option value="AwaitingApproval">Awaiting Approval</Select.Option>
                                    <Select.Option value="Scheduling">Scheduling</Select.Option>
                                    <Select.Option value="Scheduled">Scheduled</Select.Option>
                                    <Select.Option value="Vaccinated">Vaccinated</Select.Option>
                                    <Select.Option value="InformationNeeded">Information Needed</Select.Option>
                                    <Select.Option value="Rejected">Rejected</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

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