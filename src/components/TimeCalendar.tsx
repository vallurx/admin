import React, { CSSProperties } from 'react';
import { Col, Divider, Row, Tag, Typography } from 'antd';
import dayjs from 'dayjs';

interface CalendarEvent {
    timestamp: number;
    content: string;
}

interface TimeCalendarProps {
    events: CalendarEvent[];
}

const timeStyles: CSSProperties = {
    marginTop: 10,
    textAlign: 'right'
}

const TimeCalendar = (props: TimeCalendarProps) => {
    const { events } = props;

    const combineEventsByHour = () => {
        return events.reduce((acc: CalendarEvent[][], value: CalendarEvent) => {
            const hourArr = acc.find(arr => {
                if (arr.length === 0) {
                    return undefined;
                }

                return dayjs(arr[0].timestamp).isSame(value.timestamp, 'hour') ? arr : undefined;
            });

            if (hourArr) {
                hourArr.push(value);
            } else {
                acc.push([value]);
            }

            return acc;
        }, []);
    };

    return (
        <div style={{maxWidth: '800px', margin: 'auto', overflowY: 'scroll', height: 'auto'}}>
            {events.length > 0 ? (
                combineEventsByHour().map((eventsInHour, i) => {
                    const dayObjForHour = dayjs(eventsInHour[0].timestamp);

                    return (
                        <div key={i}>
                            <Row gutter={8}>
                                <Col span={3}>
                                    <Typography.Title level={4} style={timeStyles}>
                                        {dayObjForHour.format('h')}:00 {dayObjForHour.format('A')}
                                    </Typography.Title>
                                </Col>

                                <Col span={21}>
                                    <Divider />

                                    {eventsInHour.map(e => (
                                        <Tag key={e.timestamp}>{e.content}</Tag>
                                    ))}
                                </Col>
                            </Row>
                        </div>
                    );
                })
            ) : <Typography.Title level={2} style={{textAlign: 'center'}}>No Vaccines Scheduled</Typography.Title> }
        </div>
    )
};

export default TimeCalendar;