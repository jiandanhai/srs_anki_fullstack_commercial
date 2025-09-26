import React from 'react';
import { Form, Input, Button, message } from 'antd';
import useStore from '../store/useStore';

const API_BASE = 'http://localhost:4000';

const CardForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { token } = useStore();

  const onFinish = async (values: { question: string; answer: string }) => {
    try {
      const res = await fetch(`${API_BASE}/api/cards`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        message.success('创建成功');
        onSuccess();
      } else {
        const err = await res.json();
        message.error(err.message || '创建失败');
      }
    } catch (err) {
      message.error('网络或服务器错误');
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="question" label="正面（问题）" rules={[{ required: true }]}>
        <Input placeholder="题面 / 问题" />
      </Form.Item>
      <Form.Item name="answer" label="背面（答案）" rules={[{ required: true }]}>
        <Input placeholder="答案" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          保存
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CardForm;
