import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Statistic, message } from 'antd';
import useStore from '../store/useStore';

const API_BASE = 'http://localhost:4000';

const DashboardPage: React.FC = () => {
  const { token, user } = useStore();
  const [stats, setStats] = useState<{ dueToday: number; completedToday: number; totalCards: number } | null>(null);

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/cards/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        message.error(err.message || '获取统计失败');
        return;
      }
      const json = await res.json();
      // 假设后端返回 { dueToday, completedToday, totalCards }
      setStats(json);
    } catch (err) {
      message.error('网络或服务器错误');
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Card>
        <h2>欢迎, {user?.username ?? '学员'}</h2>
        <p>开始你的复习之旅 — 我们根据记忆曲线为你安排今日任务。</p>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => (window.location.href = '/review')} style={{ marginRight: 12 }}>
            开始复习
          </Button>
          <Button onClick={() => (window.location.href = '/cards')}>管理卡片</Button>
        </div>
      </Card>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日到期"
              value={stats ? stats.dueToday : 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已完成复习"
              value={stats ? stats.completedToday : 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="总卡片数" value={stats ? stats.totalCards : 0} />
          </Card>
        </Col>
      </Row>

      <Card title="快捷操作" style={{ marginTop: 16 }}>
        <Button type="dashed" onClick={() => (window.location.href = '/cards')} style={{ marginRight: 8 }}>
          新建卡片
        </Button>
        <Button onClick={() => (window.location.href = '/review')}>今日复习</Button>
      </Card>
    </div>
  );
};

export default DashboardPage;
