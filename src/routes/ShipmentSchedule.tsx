import React, { useState } from 'react';
import { Button, Calendar, Col, Divider, Row, Tag, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import { useScheduleBlocks, useVaccine } from '../lib/data/use-vaccines';
import { useParams } from 'react-router';
import { ScheduleBlock } from '../types/vaccine';

const ShipmentSchedule = () => {
    const { id } = useParams<{ id: string }>();
    const { vaccine } = useVaccine(parseInt(id));
    const { scheduleBlocks } = useScheduleBlocks(parseInt(id));
    const [selectedDay, setSelectedDay] = useState(dayjs().valueOf());

    const dateCellRenderer = (value: any) => {
        if (!scheduleBlocks) {
            return null;
        }

        const blocksInDay = scheduleBlocks.filter(b => dayjs(value.valueOf()).isSame(dayjs(b.start_at), 'day'));
        const compactedBlocks = blocksInDay.reduce((acc: [ScheduleBlock[]], currentValue) => {
            let lastSub = acc[acc.length - 1];
            if (lastSub.length <= 0) {
                lastSub.push(currentValue);
            } else {
                if (lastSub[lastSub.length - 1].end_at === currentValue.start_at) {
                    lastSub.push(currentValue);
                } else {
                    acc.push([currentValue]);
                }
            }

            return acc;
        }, [[]]);

        return compactedBlocks.map(blocks => {
            if (blocks.length === 0) {
                return null;
            }

            const start = dayjs(blocks[0].start_at).format('LT');
            const end = dayjs(blocks[blocks.length - 1].end_at).format('LT');

            return (
                <><Tag>{start} to {end}</Tag></>
            )
        })
    };

    const onDaySelect = (value: any) => setSelectedDay(value.valueOf());

    return (
        <>
            <Typography.Title level={2}>Vaccine Schedule</Typography.Title>

            <Row gutter={16}>
                <Col xl={20} md={24}>
                    <Calendar onSelect={onDaySelect} dateCellRender={dateCellRenderer} />
                </Col>

                <Col xl={4} md={24}>
                    <Timeline mode="left">
                        {scheduleBlocks?.filter(block => dayjs(block.start_at).isSame(dayjs(selectedDay), 'day')).map(block => (
                            <Timeline.Item
                                key={block.id}
                                label={dayjs(block.start_at).format('LT')}
                            >
                                {block.slots} doses
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Col>
            </Row>

            <Divider>
                <Button type="primary">Create Scheduling Block</Button>
            </Divider>
        </>
    )
};

export default ShipmentSchedule;