import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Space } from 'antd';
import useStore from '../store/useStore';

/**
 * LoginPage
 * - 支持用户名/密码登录（POST /api/users/login）
 * - 提供开发用的“模拟 OAuth 登录”按钮（POST /api/users/oauth）
 *   生产环境请替换为真实 OAuth 流程（redirect -> callback）
 */
const API_BASE = 'http://localhost:4000';

const LoginPage: React.FC = () => {
  const { setToken } = useStore();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        setToken(data.access_token);
        message.success('登录成功');
        window.location.href = '/dashboard';
      } else {
        message.error(data.message || data.error || '登录失败');
      }
    } catch (err) {
      message.error('网络或服务器错误');
    } finally {
      setLoading(false);
    }
  };

  // 开发/联调用：模拟 OAuth 登录（后端会创建或查找用户，并返回 access_token）
  // 生产应当由后端完成第三方 token 验证并在回调处返回 JWT
  const handleOAuthSimulate = async (provider: string) => {
    setOauthLoading(true);
    try {
      const payload = {
        provider,
        oauthId: `dev-${provider}-${Date.now()}`,
        username: `${provider}_user_${Date.now()}`,
      };
      const res = await fetch(`${API_BASE}/api/users/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        setToken(data.access_token);
        message.success(`${provider} 登录成功`);
        window.location.href = '/dashboard';
      } else {
        message.error(data.message || 'OAuth 登录失败');
      }
    } catch (err) {
      message.error('OAuth 网络或服务器错误');
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Card title="登录" style={{ width: 360 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>或使用第三方登录（开发模拟）</div>
            <Space>
              <Button onClick={() => handleOAuthSimulate('google')} loading={oauthLoading}>
                Google（模拟）
              </Button>
              <Button onClick={() => handleOAuthSimulate('wechat')} loading={oauthLoading}>
                WeChat（模拟）
              </Button>
              <Button onClick={() => handleOAuthSimulate('email')} loading={oauthLoading}>
                企业邮箱（模拟）
              </Button>
            </Space>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
