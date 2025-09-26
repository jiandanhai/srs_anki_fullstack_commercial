import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import CardForm from '../components/CardForm';
import useStore from '../store/useStore';

const API_BASE = 'http://localhost:4000';

const CardManagementPage: React.FC = () => {
  const { token } = useStore();
  const [cards, setCards] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  const fetchCards = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        message.error(err.message || '获取卡片失败');
        return;
      }
      const data = await res.json();
      // 假设后端直接返回数组，如果返回包装对象请根据后端修改
      setCards(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      message.error('网络或服务器错误');
    }
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)} style={{ marginBottom: 16 }}>
        新建卡片
      </Button>
      <Table
        rowKey="id"
        dataSource={cards}
        columns={[
          { title: '题面', dataIndex: 'question' },
          { title: '答案', dataIndex: 'answer' },
          { title: '下次复习时间', dataIndex: 'nextReviewAt' },
        ]}
      />
      <Modal open={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <CardForm
          onSuccess={() => {
            setVisible(false);
            fetchCards();
          }}
        />
      </Modal>
    </div>
  );
};

export default CardManagementPage;
