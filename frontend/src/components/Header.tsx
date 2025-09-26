import React from 'react';
import { Layout, Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import useStore from '../store/useStore';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { user, clearAuth } = useStore();
console.log('React version:', React.version);
console.log('useStore:', useStore);
  const handleLogout = () => {
    clearAuth();
    // 跳回登录页
    window.location.href = '/login';
  };

  const menu = (
    <Menu>
      <Menu.Item key="username" disabled>
        <span style={{ fontWeight: 600 }}>{user?.username ?? 'Guest'}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginRight: 24 }}>
        SRS - 艾森复习
      </div>

      <Menu theme="dark" mode="horizontal" selectable={false} style={{ flex: 1 }}>
        <Menu.Item key="dashboard">
          <a href="/dashboard">仪表盘</a>
        </Menu.Item>
        <Menu.Item key="cards">
          <a href="/cards">卡片管理</a>
        </Menu.Item>
        <Menu.Item key="review">
          <a href="/review">复习</a>
        </Menu.Item>
      </Menu>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <Dropdown overlay={menu} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
              <span style={{ color: '#fff' }}>{user.username}</span>
            </div>
          </Dropdown>
        ) : (
          <div>
            <Button type="primary" onClick={() => (window.location.href = '/login')}>
              登录
            </Button>
          </div>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
