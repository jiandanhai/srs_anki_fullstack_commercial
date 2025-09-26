import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CardManagementPage from './pages/CardManagementPage';
import ReviewPage from './pages/ReviewPage';
import Header from './components/Header';
import useStore from './store/useStore';
import OAuthCallback from './pages/OAuthCallback';

const { Content } = Layout;

const App: React.FC = () => {
  const { token } = useStore();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {token && <Header />}
      <Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={token ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/cards"
            element={token ? <CardManagementPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/review"
            element={token ? <ReviewPage /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
