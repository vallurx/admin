import React from 'react';
import { useApplication } from '../lib/data/use-application';
import { useParams } from 'react-router';
import { Button, Col, Divider, Form, Input, Row, Select, Skeleton, Typography } from 'antd';
import VaccineApplicationUI from '../components/VaccineApplicationUI';

const ApplicationResults = () => {
    const { id } = useParams<{ id: string }>();
    const { application } = useApplication(parseInt(id));

    if (!application) {
        return <Skeleton active />;
    }

    return (
        <>
            <Typography.Title level={2}>Vaccine Application Results</Typography.Title>

            <VaccineApplicationUI application={application} />

            <Divider>Vaccine Result Information</Divider>

            <Form
                layout="vertical"
                initialValues={{
                    dose_size: 1
                }}
            >
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item name="cvx_vaccine_code" label="CVX Vaccine Code" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="cpt_vaccine_code" label="CPT Vaccine Code" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="lot_number" label="Lot Number" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item name="anatomical_route" label="Anatomical Route" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="ID">Intradermal</Select.Option>
                                <Select.Option value="IM">Intramuscular</Select.Option>
                                <Select.Option value="IV">Intravenous</Select.Option>
                                <Select.Option value="NS">Nasal</Select.Option>
                                <Select.Option value="O">Oral</Select.Option>
                                <Select.Option value="SC">Subcutaneous</Select.Option>
                                <Select.Option value="TR">Transdermal</Select.Option>
                                <Select.Option value="OTH">Other Miscellaneous</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="anatomical_site" label="Anatomical Site" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="LA">Left Arm</Select.Option>
                                <Select.Option value="LT">Left Thigh</Select.Option>
                                <Select.Option value="LD">Left Deltoid</Select.Option>
                                <Select.Option value="LG">Left Gluteus Medius</Select.Option>
                                <Select.Option value="LVL">Left Vastua Lateralis</Select.Option>
                                <Select.Option value="LLFA">Left Lower Forearm</Select.Option>
                                <Select.Option value="RA">Right Arm</Select.Option>
                                <Select.Option value="RT">Right Thigh</Select.Option>
                                <Select.Option value="RD">Right Deltoid</Select.Option>
                                <Select.Option value="RG">Right Gluteus Medius</Select.Option>
                                <Select.Option value="RVL">Right Vastua Lateralis</Select.Option>
                                <Select.Option value="RLFA">Right Lower Forearm</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item name="dose_size" label="Dose Size" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value={0.5}>Half</Select.Option>
                                <Select.Option value={1}>Full</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="manufacturer" label="Manufacturer" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="MOD">Moderna</Select.Option>
                                <Select.Option value="PFR">Pfizer</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="notes" label="Notes">
                    <Input.TextArea rows={10} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ApplicationResults;