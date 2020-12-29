import React, { useEffect, useState } from 'react';
import { useApplication } from '../lib/data/use-application';
import { useParams } from 'react-router';
import { Button, Col, Divider, Form, Input, notification, Radio, Row, Skeleton, Space, Typography } from 'antd';
import VaccineApplicationUI from '../components/VaccineApplicationUI';
import { axios } from '../lib/axios';
import { saveAs } from 'file-saver';

type AppStatus = 'Scheduling' | 'Rejected' | 'AwaitingApproval' | 'InformationNeeded';

const ApplicationItem = () => {
    const { id } = useParams<{ id: string }>();
    const { application, mutate } = useApplication(parseInt(id));
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

            setAppStatus('AwaitingApproval');
            setAppNotes('');

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
            const res = await axios.get(`/api/facilities/1/application/${id}/qr_code`);

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
            const res = await axios.get(`/api/facilities/1/application/${id}/export_pdf`, {
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
            <Typography.Title>Application Review</Typography.Title>

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

            <Divider>Review</Divider>

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
        </>
    )
};

export default ApplicationItem;