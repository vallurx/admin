import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ColumnsType } from 'antd/es/table';
import { PatientListItem } from '../lib/types';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Form, Input, Row, Table, Typography } from 'antd';
import { DatePicker } from '../components/dayjs';
import { SearchOutlined } from '@ant-design/icons';
import { PatientFilters, usePatientList } from '../lib/data/use-patient';
import { formattedName } from '../lib/util';

const PatientList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [tableFilters, setTableFilters] = useState<PatientFilters>({
        filter_name: '',
        filter_dob: '',
        filter_phone: ''
    });
    const { patients } = usePatientList(currentPage, 10, tableFilters);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const filterTable = (data: PatientFilters & { filter_dob: Dayjs }) => {
        const dob = dayjs(data.filter_dob);

        setTableFilters({
            ...data,
            filter_dob: dob.isValid() ? dob.format('MM/DD/YYYY') : ''
        });
    }

    const columns: ColumnsType<PatientListItem> = [
        {
            title: 'Full Name',
            render: (value, record) => {
                return formattedName(record);
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
            title: 'Actions',
            render: (value, record) => {
                return (
                    <Link to={'/patients/' + record.id}>
                        <Button type="primary">View Patient</Button>
                    </Link>
                )
            },
            key: 'actions'
        }
    ];

    return (
        <>
            <Typography.Title level={2}>Patients</Typography.Title>

            <Card style={{backgroundColor: '#FAFAFA', borderBottom: 'none'}}>
                <Form
                    layout="vertical"
                    onFinish={filterTable}
                    initialValues={tableFilters}
                >
                    <Row gutter={8}>
                        <Col span={8}>
                            <Form.Item label="Patient Name" name="filter_name">
                                <Input allowClear />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Patient Phone" name="filter_phone">
                                <Input allowClear />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="Date of Birth" name="filter_dob">
                                <DatePicker style={{width: '100%'}} format="MM/DD/YYYY" />
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
                dataSource={patients?.items}
                pagination={{
                    pageSize: 10,
                    current: currentPage,
                    total: patients?.total,
                    onChange: onPageChange
                }}
                rowKey="id"
                loading={!patients}
            />
        </>
    );
};

export default PatientList;