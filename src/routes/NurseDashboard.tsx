import React, { useState } from 'react';
import { Button, Divider, Form, Modal, notification, Spin, Statistic, Typography } from 'antd';
import useUser from '../lib/data/use-user';
import { useApplicationList } from '../lib/data/use-application';
import { Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { axios } from '../lib/axios';
import { Dayjs } from 'dayjs';
import { DatePicker } from '../components/dayjs';

const NurseDashboard = () => {
    const { user, loading } = useUser();
    const { applicationList } = useApplicationList(1, 10, { status: 'AwaitingApproval' });
    const [impactVisible, setImpactVisible] = useState(false);
    const [impactLoading, setImpactLoading] = useState(false);
    const [impactForm] = Form.useForm();
    const [userCSVVisible, setUserCSVVisible] = useState(false);
    const [userCSVLoading, setUserCSVLoading] = useState(false);
    const [userCSVForm] = Form.useForm();

    const generateImpactReport = async (data: { date: Dayjs }) => {
        setImpactLoading(true);

        try {
            const startTimestamp = data.date.startOf('day');
            const endTimestamp = data.date.endOf('day');
            const reportRes = await axios.get(`/api/facilities/1/impact?start=${startTimestamp.valueOf()}&end=${endTimestamp.valueOf()}`, {
                responseType: 'blob'
            });

            saveAs(reportRes.data, `Impact Report ${startTimestamp.format('MM-DD-YYYY')} - ${endTimestamp.format('MM-DD-YYYY')}.csv`);
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'Unable to generate your impact report.'
            });
        } finally {
            setImpactLoading(false);
        }
    };

    const generateUserCSVReport = async (data: { date: [Dayjs, Dayjs] }) => {
        setUserCSVLoading(true);

        try {
            const startTimestamp = data.date[0].startOf('day');
            const endTimestamp = data.date[1].endOf('day');
            const reportRes = await axios.get(`/api/facilities/1/user_csv?start=${startTimestamp.valueOf()}&end=${endTimestamp.valueOf()}`, {
                responseType: 'blob'
            });

            saveAs(reportRes.data, `VallurX Application Report ${startTimestamp.format('MM-DD-YYYY')} - ${endTimestamp.format('MM-DD-YYYY')}.csv`);
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'Unable to generate your application report.'
            });
        } finally {
            setUserCSVLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <Modal
                title="Impact Report"
                visible={impactVisible}
                onCancel={() => setImpactVisible(false)}
                onOk={impactForm.submit}
                confirmLoading={impactLoading}
            >
                <Form
                    form={impactForm}
                    onFinish={generateImpactReport}
                    layout="vertical"
                >
                    <Form.Item label="Generate Report For" name="date">
                        <DatePicker.RangePicker format="M/D/YYYY" style={{width: '100%'}} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Application Data Report"
                visible={userCSVVisible}
                onCancel={() => setUserCSVVisible(false)}
                onOk={userCSVForm.submit}
                confirmLoading={userCSVLoading}
            >
                <Form
                    form={userCSVForm}
                    onFinish={generateUserCSVReport}
                    layout="vertical"
                >
                    <Form.Item label="Generate Report For" name="date">
                        <DatePicker.RangePicker format="M/D/YYYY" style={{width: '100%'}} />
                    </Form.Item>
                </Form>
            </Modal>

            <Typography.Title>Welcome, {user?.name}</Typography.Title>

            <Typography.Paragraph>This space will have information nurses need to see at a glance. For example, there are</Typography.Paragraph>

            <Statistic value={applicationList?.total} title="Pending Applications" />
            <Link to="/queue">
                <Button type="primary" disabled={applicationList?.total === 0}>
                    {applicationList?.total === 0 ? 'Queue Empty!' : 'Enter Queue'}
                </Button>
            </Link>

            <Divider />

            <Button type="primary" size="large" onClick={() => setUserCSVVisible(true)} icon={<DownloadOutlined />}>
                Export Application Data
            </Button>

            <Button type="primary" size="large" style={{marginLeft: 10}} onClick={() => setImpactVisible(true)} icon={<DownloadOutlined />}>
                Export Impact Report
            </Button>
        </Spin>
    );
};

export default NurseDashboard;