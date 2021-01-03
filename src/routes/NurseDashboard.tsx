import React from 'react';
import { Button, Spin, Statistic, Typography } from 'antd';
import useUser from '../lib/data/use-user';
import { useApplicationList } from '../lib/data/use-application';
import { Link } from 'react-router-dom';

const NurseDashboard = () => {
    const { user, loading } = useUser();
    const { applicationList } = useApplicationList(1, 10, { status: 'AwaitingApproval', name: '' });

    return (
        <Spin spinning={loading}>
            <Typography.Title>Welcome, {user?.name}</Typography.Title>

            <Typography.Paragraph>This space will have information nurses need to see at a glance. For example, there are</Typography.Paragraph>

            <Statistic value={applicationList?.total} title="Pending Applications" />
            <Link to="/queue">
                <Button type="primary" disabled={applicationList?.total === 0}>
                    {applicationList?.total === 0 ? 'Queue Empty!' : 'Enter Queue'}
                </Button>
            </Link>
        </Spin>
    );
};

export default NurseDashboard;