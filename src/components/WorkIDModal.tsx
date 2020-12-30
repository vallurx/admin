import React, { useState } from 'react';
import { Form, Input, Modal, notification } from 'antd';
import { axios } from '../lib/axios';

interface WorkIDProps {
    visible: boolean;
    onFinish: () => void;
    image: string,
}

const WorkIDModal = (props: WorkIDProps) => {
    const { visible, onFinish, image } = props;

    return (
        <Modal
            title="Work ID"
            visible={visible}
            onOk={onFinish}
            onCancel={onFinish}
            footer={null}
            width="auto"
            bodyStyle={{display: 'inline-block'}}
            wrapClassName='imageModalWrap'
        >
            <img src={image} onClick={onFinish} alt="Work ID Image Not Found" />
        </Modal>
    );
};

export default WorkIDModal;