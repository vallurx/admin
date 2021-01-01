import React from 'react';
import { useParams } from 'react-router';
import { useApplicationsByScheduleBlock } from '../lib/data/use-application';
import { Button, Card, Descriptions, Divider, List, Typography } from 'antd';
import { useScheduleBlock } from '../lib/data/use-vaccines';
import dayjs from 'dayjs';
import { formattedName } from '../lib/util';
import { Link } from 'react-router-dom';

const ScheduleApplications = () => {
    const { id, blockId } = useParams<{ id: string, blockId: string }>();
    const { scheduleBlock } = useScheduleBlock(parseInt(blockId));
    const { applications } = useApplicationsByScheduleBlock(parseInt(blockId));

    return (
        <>
            <Typography.Title level={5} style={{textAlign: 'center'}}>Vaccinations Scheduled For</Typography.Title>
            <Typography.Title level={2} style={{textAlign: 'center', margin: 0}}>{dayjs(scheduleBlock?.start_at).format('LLLL')}</Typography.Title>

            <Link to={'/vaccines/' + id + '/schedule'}>
                <Button type="primary">Back</Button>
            </Link>

            <Divider />

            <List
                grid={{gutter: 8, column: 3}}
                dataSource={applications}
                loading={!applications}
                renderItem={(app, i) => (
                    <List.Item>
                        <Card title={'Patient #' + (i + 1)}>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Patient Name">{formattedName(app)}</Descriptions.Item>
                                <Descriptions.Item label="Date of Birth">{app.date_of_birth}</Descriptions.Item>
                                <Descriptions.Item label="Phone Number">{app.phone_number}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
};

export default ScheduleApplications;