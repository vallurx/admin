import React from 'react';
import { Button, Col, Row, Spin, Statistic, Typography } from 'antd';
import useUser from '../lib/data/use-user';
import { Link } from 'react-router-dom';
import { useApprovalList } from '../lib/data/use-approval';

const NurseDashboard = () => {
    const { user, loading } = useUser();
    const { approvalList } = useApprovalList();

    return (
        <Spin spinning={loading}>
            <Typography.Title>Welcome, {user?.name}</Typography.Title>

            <Row gutter={8}>
                <Col span={12}>
                    <Statistic title="Vaccine Doses" value={10000} />
                </Col>
                <Col span={12}>
                    <Statistic title="Pending Applications" value={approvalList?.total} />
                    <Link to="/queue">
                        <Button type="primary" disabled={approvalList?.total === 0}>
                            {approvalList?.total === 0 ? 'Queue Empty!' : 'Enter Queue'}
                        </Button>
                    </Link>
                </Col>
            </Row>
        </Spin>
    );
};

export default NurseDashboard;