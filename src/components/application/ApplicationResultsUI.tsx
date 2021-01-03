import React from 'react';
import { Button, Card, Col, Form, Input, notification, Row, Select } from 'antd';
import DatePicker from '../dayjs/DatePicker';
import SignaturePad from 'react-signature-pad-wrapper'

interface ApplicationResultsForm {
    anatomical_route: string;
    anatomical_site: string;
    dose_size: string;
    expiration_date: string;
    notes: string;
}

interface ApplicationResultsUIProps {
    notes: string;
    onSubmit: (data: ApplicationResultsForm) => void;
}

const ApplicationResultsUI = (props: ApplicationResultsUIProps) => {
    const { onSubmit, notes } = props;
    let signatureCanvas: any;

    const onReview = (data: any) => {
        if (signatureCanvas?.isEmpty()) {
            notification.error({
                message: 'Uh oh!',
                description: 'A signature is required to submit results.'
            });

            return;
        }

        onSubmit({
            ...data,
            expiration_date: data.expiration_date.format('MM/DD/YYYY'),
            signatureData: signatureCanvas?.toDataURL('image/png')
        });
    }

    return (
        <Form
            layout="vertical"
            initialValues={{
                dose_size: 'full',
                notes: notes || ''
            }}
            onFinish={onReview}
        >
            <Row gutter={8}>
                <Col span={6}>
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

                <Col span={6}>
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

                <Col span={6}>
                    <Form.Item name="dose_size" label="Dose Size" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="half">Half</Select.Option>
                            <Select.Option value="full">Full</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item name="expiration_date" label="Expiration Date">
                        <DatePicker style={{width: '100%'}} format="MM/DD/YYYY" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item name="notes" label="Notes">
                <Input.TextArea rows={10} />
            </Form.Item>

            <Card title="Signature" style={{border: '1px solid #d9d9d9'}}>
                <SignaturePad ref={(ref: any) => signatureCanvas = ref} height={250} />
            </Card>

            <br />

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
};

export default ApplicationResultsUI;