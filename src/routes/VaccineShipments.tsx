import { Button, Card, Descriptions, Divider, List, Typography } from 'antd';
import React, { useState } from 'react';
import { useVaccineShipmentList } from '../lib/data/use-vaccines';
import NewVaccineShipmentModal from '../components/NewVaccineShipmentModal';
import { VaccineBatch } from '../types/vaccine';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { manufacturers } from '../lib/manufacturers';

const VaccineShipments = () => {
    const [visible, setVisible] = useState(false);
    const { vaccineShipments, loading, mutate } = useVaccineShipmentList();

    const onCreate = () => {
        setVisible(false);
        mutate();
    };

    return (
        <>
            <Typography.Title level={2}>Vaccine Shipments</Typography.Title>

            <NewVaccineShipmentModal visible={visible} onOk={onCreate} onCancel={() => setVisible(false)} />

            <List
                grid={{ gutter: 16, xxl: 3, xl: 3, lg: 2, md: 1, sm: 2, xs: 1 }}
                dataSource={vaccineShipments}
                loading={loading}
                renderItem={(item: VaccineBatch) => (
                    <List.Item>
                        <Card title={item.name} extra={
                            <Link to={`/vaccines/${item.id}/schedule`}>
                                <Button type="primary">Schedule</Button>
                            </Link>
                        }>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Vaccines in Shipment">
                                    {item.vaccine_count}
                                </Descriptions.Item>
                                <Descriptions.Item label="Manufacturer">
                                    {manufacturers[item.manufacturer]}
                                </Descriptions.Item>
                                <Descriptions.Item label="Shipment Created">
                                    {dayjs(item.created_at).utc(true).local().format('LLL')}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </List.Item>
                )}
            />

            <Divider>
                <Button type="primary" onClick={() => setVisible(true)}>New Vaccine Shipment</Button>
            </Divider>
        </>
    );
};

export default VaccineShipments;