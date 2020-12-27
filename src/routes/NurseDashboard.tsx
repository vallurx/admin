import React from 'react';
import { Button, Col, Row, Spin, Statistic, Typography } from 'antd';
import useUser from '../lib/data/use-user';
import { Link } from 'react-router-dom';
import { useApplicationList } from '../lib/data/use-application';

const NurseDashboard = () => {
    const { user, loading } = useUser();
    const { applicationList } = useApplicationList();

    return (
        <Spin spinning={loading}>
            <Typography.Title>Welcome, {user?.name}</Typography.Title>

            <Row gutter={8}>
                <Col span={12}>
                    <Statistic title="Vaccine Doses" value={10000} />
                </Col>
                <Col span={12}>
                    <Statistic title="Pending Applications" value={applicationList?.total} />
                    <Link to="/queue">
                        <Button type="primary" disabled={applicationList?.total === 0}>
                            {applicationList?.total === 0 ? 'Queue Empty!' : 'Enter Queue'}
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Spin>
    );
};

export default NurseDashboard;