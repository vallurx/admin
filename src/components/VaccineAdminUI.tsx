import React, { useEffect, useState } from 'react';
import { Button, Form, Divider, Tabs, notification, Skeleton, Select, Col, Radio, Row, Typography, Space, Input } from 'antd';
import VaccineApplicationUI from './VaccineApplicationUI';
import { useApplication } from '../lib/data/use-application';
import { AppStatus } from '../types/application';
import { axios } from '../lib/axios';

interface VaccineAdminUIProps {
    application_id: number;
    editable?: boolean;
    onEdit?: () => Promise<void>;
}

const VaccineAdminUI = (props: VaccineAdminUIProps) => {
    const { application, mutate } = useApplication(props.application_id);
    const [appStatus, setAppStatus] = useState<AppStatus>('AwaitingApproval');
    const [appNotes, setAppNotes] = useState('');
    const [pdfLoading, setPDFLoading] = useState(false);
    const [qrLoading, setQRLoading] = useState(false);
    

    const reviewApplication = async () => {
        if (appStatus === 'AwaitingApproval') {
            notification.error({
                message: 'Hold on!',
                description: 'You must make a decision. If you are unsure, select Information Needed.'
            });

            return;
        }
    
        try {
            await axios.post(`/api/facilities/1/application/${application?.id}`, {
                status: appStatus,
                notes: appNotes
            });

            notification.success({
                message: 'Success!',
                description: 'Successfully reviewed vaccine application!'
            });

            setAppStatus(appStatus);
            setAppNotes('');

            if (props.onEdit != null) {
                await props.onEdit();
            }
            await mutate();
        } catch (e) {
            notification.error({
                message: 'Un oh!',
                description: 'There was an error reviewing this application. Please contact VallurX.'
            });
        }
    }

    const generateQRCode = async () => {
        setQRLoading(true);

        try {
            const res = await axios.get(`/api/facilities/1/application/${application?.id}/qr_code`);

            const w = window.open();

            if (w) {
                const html = `
                    <!DOCTYPE HTML>
                    <html lang="en-us">
                    <body>
                    <h1>Vaccine Information</h1>
                    <p><b>Name:</b> ${application?.first_name} ${application?.last_name}</p>
                    <p><b>Date of Birth:</b> ${application?.date_of_birth}</p>
                    <p><b>Phone Number: </b> ${application?.phone_number}</p>
                    <img style="width: 500px" alt="qr code" src="data:image/png;base64, ${res.data.data}" />
                    </body>
                    </html>
                `;

                w.document.write(html);

                setTimeout(() => {
                    w.window.print();
                    w.document.close();
                    setQRLoading(false);
                }, 100);
            }
        } catch (e) {
            notification.error({
                message: 'Uh oh!',
                description: 'There was an error generating a QR code.'
            });

            setQRLoading(false);
        }
    }

    const exportPDF = async () => {
        setPDFLoading(true);

        try {
            const res = await axios.get(`/api/facilities/1/application/${application?.id}/export_pdf`, {
                responseType: 'blob'
            });

            saveAs(res.data, `${application?.first_name} ${application?.last_name} Vaccine Application.pdf`);
        } catch (e) {
            console.error(e);
        } finally {
            setPDFLoading(false);
        }
    }

    useEffect(() => {
        if (application) {
            setAppStatus(application.status as AppStatus);
            setAppNotes(application.notes);
        }
    }, [application]);

    if (!application) {
        return <Skeleton active />;
    }

    
    return (
        <>

            <VaccineApplicationUI application={application} editable onEdit={mutate} />

            <br />

            <Space>
                {application.status === 'Scheduled' && (
                    <Button type="primary" onClick={generateQRCode} loading={qrLoading}>
                        Generate QR Code
                    </Button>
                )}

                <Button type="primary" onClick={exportPDF} loading={pdfLoading}>
                    Export PDF
                </Button>
            </Space>

            <Divider>Status</Divider>

            <Tabs size="large" centered>
                <Tabs.TabPane tab="Review & Approval" key="1">
                    <Row>
                        <Col span={16} offset={4}>
                            <Form layout="vertical">
                                <Form.Item label="Decision">
                                    <Radio.Group value={appStatus} onChange={e => setAppStatus(e.target.value)} buttonStyle="solid">
                                        <Radio.Button value="AwaitingApproval" disabled>Pending</Radio.Button>
                                        <Radio.Button value="Scheduling">Approved</Radio.Button>
                                        <Radio.Button value="Rejected">Rejected</Radio.Button>
                                        <Radio.Button value="InformationNeeded">Information Needed</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item label="Notes">
                                    <Input.TextArea value={appNotes} onChange={e => setAppNotes(e.target.value)} rows={10} />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" onClick={reviewApplication}>Submit</Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Tabs.TabPane>
                {(application.status == 'Scheduled' || application.status == 'Vaccinated') && <Tabs.TabPane tab="Vaccination Results" key="2">
                    <Form
                        layout="vertical"
                        initialValues={{
                            dose_size: 'full'
                        }}
                    >
                        <Row gutter={8}>
                            <Col span={8}>
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

                            <Col span={8}>
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

                            <Col span={8}>
                                <Form.Item name="dose_size" label="Dose Size" rules={[{ required: true }]}>
                                    <Select>
                                        <Select.Option value="half">Half</Select.Option>
                                        <Select.Option value="full">Full</Select.Option>
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
                </Tabs.TabPane>}
            </Tabs>
        </>
    );
};

export default VaccineAdminUI;