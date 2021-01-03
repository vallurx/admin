import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { VaccineBatch } from '../../lib/types/vaccine';
import { DatePicker } from '../dayjs';
import { Col, Divider, Input, Modal, notification, Row, Space, Tag, Typography } from 'antd';
import { axios } from '../../lib/axios';

interface NewSchedulingBlockModalProps {
    onOk: () => void;
    onCancel: () => void;
    vaccine: VaccineBatch;
    visible: boolean;
    activeDate: Dayjs;
}

// TODO: Clear fields on cancel
const NewSchedulingBlockModal = (props: NewSchedulingBlockModalProps) => {
    const { onOk, onCancel, vaccine, visible, activeDate } = props;
    const [times, setTimes] = useState<Dayjs[]>([]);
    const [selectedTimes, setSelectedTimes] = useState<number[]>([]);
    const [slots, setSlots] = useState(10);

    const onTimePick = (times: any, timeStrings: [string, string]) => {
        if (!timeStrings[0] || !timeStrings[1]) {
            return;
        }

        const time1 = dayjs(`${activeDate.format('L')} ${timeStrings[0]}`);
        const time2 = dayjs(`${activeDate.format('L')} ${timeStrings[1]}`);
        const timesArr = [];

        for (let i = time1.valueOf(); i < time2.valueOf(); i += (15 * 60 * 1000)) {
            timesArr.push(dayjs(i));
        }

        setTimes(timesArr);
        setSelectedTimes(timesArr.map(t => t.valueOf()));
    };

    const handleTimeSelect = (tag: number, checked: boolean) => {
        if (checked) {
            setSelectedTimes(prevState => [...prevState, tag]);
        } else {
            setSelectedTimes(prevState => prevState.filter(t => t !== tag));
        }
    }

    const createBatchSchedules = async () => {
        if (!slots || slots < 1) {
            notification.error({
                message: 'Oops!',
                description: 'Vaccines per Time Slot must be a positive number.'
            });

            return;
        }

        try {
            await axios.put(
                `/api/facilities/1/vaccine_shipments/${vaccine.id}/schedule_blocks`,
                {
                    blocks: selectedTimes.map(time => ({ start_at: time, duration_min: 15, slots }))
                }
            );

            onOk();
        } catch (e) {
            console.log(e);
        }
    }

    const cancelHandler = () => {
        setTimes([]);
        setSelectedTimes([]);
        setSlots(10);
        onCancel();
    }

    return (
        <Modal
            title="New Scheduling Block"
            visible={visible}
            onOk={createBatchSchedules}
            onCancel={cancelHandler}
        >
            <Space direction="vertical" style={{width: '100%'}}>
                <DatePicker value={activeDate} style={{width: '100%'}} disabled />

                <DatePicker.RangePicker
                    use12Hours
                    format="h:mm a"
                    minuteStep={15}
                    picker="time"
                    onChange={onTimePick}
                    style={{width: '100%'}}
                />

                <Input
                    defaultValue={10}
                    onChange={e => setSlots(parseInt(e.target.value))}
                    style={{width: '100%'}}
                    type="number"
                    addonAfter="Vaccines per Time Slot"
                    min={0}
                    max={100}
                />
            </Space>

            <div><Divider>Schedule Block for</Divider></div>

            {!activeDate && (
                <Typography.Title level={2} style={{textAlign: 'center'}}>Select date to get started</Typography.Title>
            )}

            <Typography.Title level={2} style={{textAlign: 'center'}}>
                {activeDate.format('LL')}
            </Typography.Title>

            <div><Divider>{vaccine.vaccine_count} doses</Divider></div>

            <Row gutter={4} wrap>
                {times.map(time => (
                    <Col span={6} key={time.valueOf()} style={{textAlign: 'center', marginBottom: 5}}>
                        <Tag.CheckableTag
                            checked={selectedTimes.indexOf(time.valueOf()) > -1}
                            onChange={checked => handleTimeSelect(time.valueOf(), checked)}
                            key={time.valueOf()}
                        >
                            {time.format('LT')}
                        </Tag.CheckableTag>
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default NewSchedulingBlockModal;