import React, { CSSProperties, useState } from 'react';
import { Button, Card, Skeleton, Space, Typography } from 'antd';
import { FastBackwardOutlined, FastForwardOutlined, StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TimeCalendar from '../components/TimeCalendar';
import { useScheduleBlocks, useVaccineShipment } from '../lib/data/use-vaccines';
import { useHistory, useParams } from 'react-router';
import NewSchedulingBlockModal from '../components/NewSchedulingBlockModal';

const weekGrid: CSSProperties = {
    display: 'flex',
    marginTop: 20
};

const dateCard: CSSProperties = {
    cursor: 'pointer',
    flex: 1,
    margin: 5
};

const activeCard: CSSProperties = {
    cursor: 'pointer',
    flex: 1,
    margin: 5,
    backgroundColor: '#EEE'
};

const ShipmentSchedule = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { scheduleBlocks, mutate } = useScheduleBlocks(parseInt(id));
    const { vaccineShipment } = useVaccineShipment(parseInt(id));
    const [visible, setVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const getSevenDayPeriod = () => {
        return [
            selectedDate.subtract(3, 'day'),
            selectedDate.subtract(2, 'day'),
            selectedDate.subtract(1, 'day'),
            selectedDate,
            selectedDate.add(1, 'day'),
            selectedDate.add(2, 'day'),
            selectedDate.add(3, 'day')
        ];
    };

    const changeDayBy = (amt: number) => {
        setSelectedDate(prevState => prevState.add(amt, 'day'));
    };

    const goToToday = () => {
        setSelectedDate(dayjs());
    }

    const onCreateScheduleBlock = () => {
        setVisible(false);
        mutate();
    };

    const goToBlock = (batchId: number) => {
        history.push('/vaccines/' + id + '/schedule/' + batchId);
    }

    if (!scheduleBlocks) {
        return <Skeleton active />;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 120px)'}}>
            {vaccineShipment && (
                <NewSchedulingBlockModal
                    onOk={onCreateScheduleBlock}
                    onCancel={() => setVisible(false)}
                    vaccine={vaccineShipment}
                    visible={visible}
                    activeDate={selectedDate}
                />
            )}

            <Typography.Title level={5} style={{textAlign: 'center'}}>Viewing Schedule For</Typography.Title>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Space>
                    <Button icon={<FastBackwardOutlined />} type="primary" size="large" onClick={() => changeDayBy(-7)} />
                    <Button icon={<StepBackwardOutlined />} type="primary" size="large" onClick={() => changeDayBy(-1)} />
                    <Typography.Title level={2} style={{textAlign: 'center', margin: 0}}>{selectedDate.format('dddd, LL')}</Typography.Title>
                    <Button icon={<StepForwardOutlined />} type="primary" size="large" onClick={() => changeDayBy(1)} />
                    <Button icon={<FastForwardOutlined />} type="primary" size="large" onClick={() => changeDayBy(7)} />
                </Space>
            </div>

            <Button type="link" onClick={goToToday}>Go To Today</Button>

            <div style={weekGrid}>
                {getSevenDayPeriod().map(day => {
                    const isActive = dayjs(selectedDate).isSame(day, 'date');
                    const scheduleBlocksOnDay = scheduleBlocks?.filter(block => dayjs(block.start_at).isSame(day, 'date'));

                    return (
                        <Card
                            style={isActive ? activeCard : dateCard}
                            key={day.valueOf()}
                            onClick={() => setSelectedDate(day)}
                        >
                            <Typography.Title level={5}>{day.format('ddd, MMMM D, YYYY')}</Typography.Title>
                            <Typography.Paragraph>{scheduleBlocksOnDay?.length} Time Slots</Typography.Paragraph>
                        </Card>
                    );
                })}
            </div>

            <div style={{margin: 'auto', marginTop: 10}}>
                <Button type="primary" onClick={() => setVisible(true)}>New Schedule Block</Button>
            </div>

            <div style={{flex: 'auto', overflow: 'scroll'}}>
                <TimeCalendar
                    events={
                        scheduleBlocks
                            .filter(block => dayjs(block.start_at).isSame(selectedDate, 'date'))
                            .map(block => ({
                                id: block.id,
                                timestamp: block.start_at,
                                content: `${dayjs(block.start_at).format('LT')} (${block.slots} Slots)`
                            }))
                    }
                    onSelect={event => goToBlock(event.id)}
                />
            </div>
        </div>
    )
};

export default ShipmentSchedule;