import React, { useEffect, useState } from 'react';
import { useApplication } from '../lib/data/use-application';
import { useParams } from 'react-router';
import { Button, Col, Divider, notification, Row, Skeleton, Space, Typography } from 'antd';
import { axios } from '../lib/axios';
import baseAxios from 'axios';
import { saveAs } from 'file-saver';
import ApplicationReviewUI from '../components/application/ApplicationReviewUI';
import PatientUI from '../components/patient/PatientUI';
import PatientApplicationUI from '../components/application/PatientApplicationUI';
import { usePatient } from '../lib/data/use-patient';
import ApplicationStatusUI from '../components/application/ApplicationStatusUI';
import ApplicationResultsUI from '../components/application/ApplicationResultsUI';
import { useVaccineShipment } from '../lib/data/use-vaccines';
import EditApplicationModal from '../components/application/EditApplicationModal';

const ApplicationItem = () => {
    const { id } = useParams<{ id: string }>();
    const { application, mutate } = useApplication(parseInt(id));
    const { vaccineShipment } = useVaccineShipment(application?.vaccine_batch_id);
    const { patient } = usePatient(application?.patient_id);
    const [reviewData, setReviewData] = useState({
        notes: '',
        status: 'AwaitingApproval'
    });
    const [visible, setVisible] = useState(false);
    const [pdfLoading, setPDFLoading] = useState(false);
    const [qrLoading, setQRLoading] = useState(false);

    const onEditApplication = () => {
        setVisible(false);
        mutate();
    }

    const reviewApplication = async (data: { notes: string, status: string }) => {
        if (data.status === 'AwaitingApproval') {
            notification.error({
                message: 'Hold on!',
                description: 'You must make a decision. If you are unsure, select Information Needed.'
            });

            return;
        }

        try {
            await axios.post(`/api/applications/${application?.id}`, data);

            notification.success({
                message: 'Success!',
                description: 'Successfully reviewed vaccine application!'
            });

            await mutate();
        } catch (e) {
            notification.error({
                message: 'Un oh!',
                description: 'There was an error reviewing this application. Please contact VallurX.'
            });
        }
    };

    const onSubmitResults = async (data: any) => {
        if (!data.signatureData) {
            notification.error({
                message: 'Uh oh!',
                description: 'A signature is required to submit results.'
            });

            return;
        }

        try {
            const resultData = {
                anatomical_route: data.anatomical_route,
                anatomical_site: data.anatomical_site,
                dose_size: data.dose_size,
                expiration_date: data.expiration_date,
                notes: data.notes,
                has_nurse_sig_image: true
            }

            const res = await axios.put('/api/applications/' + application?.id + '/results', resultData);
            const { nurse_sig_image_url } = res.data;

            const byteString = atob(data.signatureData.split(',')[1]);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            await baseAxios.put(nurse_sig_image_url, new Blob([ab], { type: 'image/png' }), {
                headers: {
                    'Content-Type': 'image/png'
                }
            });

            notification.success({
                message: 'Success!',
                description: 'You have successfully submitted the vaccination results.'
            })

            mutate();
        } catch (e) {
            console.error(e);

            notification.error({
                message: 'Uh oh!',
                description: 'There was an error submitting the results.'
            });
        }
    };

    const generateQRCode = async () => {
        setQRLoading(true);

        try {
            const res = await axios.get(`/api/applications/${id}/qr_code`);
            const w = window.open();

            if (w) {
                w.document.write(res.data);

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
    };

    const exportPDF = async () => {
        setPDFLoading(true);

        try {
            const res = await axios.get(`/api/applications/${id}/export_pdf`, {
                responseType: 'blob'
            });

            saveAs(res.data, `${patient?.first_name} ${patient?.last_name} Vaccine Application.pdf`);
        } catch (e) {
            console.error(e);
        } finally {
            setPDFLoading(false);
        }
    };

    useEffect(() => {
        if (application) {
            setReviewData({
                notes: application.notes,
                status: application.status
            });
        }
    }, [application]);

    if (!application) {
        return <Skeleton active />;
    }

    return (
        <>
            <Typography.Title>Application Review</Typography.Title>

            <EditApplicationModal visible={visible} application={application} onOk={onEditApplication} onCancel={() => setVisible(false)} />

            <ApplicationStatusUI status={application.status} />

            <br />

            <PatientUI patientId={application.patient_id} />

            <Divider />

            <PatientApplicationUI applicationId={application.id} />

            <br />

            <Space>
                <Button type="primary" onClick={() => setVisible(true)}>
                    Edit Application
                </Button>

                {application.status === 'Scheduled' && (
                    <Button type="primary" onClick={generateQRCode} loading={qrLoading}>
                        Generate QR Code
                    </Button>
                )}

                <Button type="primary" onClick={exportPDF} loading={pdfLoading}>
                    Export PDF
                </Button>
            </Space>

            {application.status === 'AwaitingApproval' && (
                <>
                    <Divider>Review</Divider>

                    <Row>
                        <Col span={16} offset={4}>
                            <ApplicationReviewUI initialValues={reviewData} onSubmit={reviewApplication} />
                        </Col>
                    </Row>
                </>
            )}

            {(application.status === 'Scheduled' || application.status === 'Vaccinated') && (
                <>
                    <Divider>Results</Divider>

                    <Row>
                        <Col span={16} offset={4}>
                            <ApplicationResultsUI onSubmit={onSubmitResults} notes={application.notes} lot_numbers={vaccineShipment?.lot_numbers || []} expiration_dates={vaccineShipment?.expiration_dates || []}  />
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default ApplicationItem;