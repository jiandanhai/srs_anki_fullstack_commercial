/**
 * OAuthCallback.tsx
 * - 用于接收后端 OAuth 回调后的重定向
 * - 支持两种后端传回方式：
 *    1) query token: /oauth/callback?token=xxx  -> 存 token 到 localStorage (如果你想)
 *    2) cookie: HttpOnly cookie 已设置 -> 前端用 /api/users/me 请求来获取用户信息
 *
 * 注意：若后端使用 cookie 方式（推荐），请使用 fetch credentials: 'include' 来请求 /api/users/me
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { message } from 'antd';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useStore();

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          // Dev-friendly: backend returned token in query
          setToken(token);
          // clean url
          window.history.replaceState({}, document.title, '/oauth/callback');
          // fetch user info
          const res = await fetch(`${API_BASE}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const json = await res.json();
            setUser(json.user || null);
            navigate('/dashboard');
            return;
          } else {
            message.error('获取用户信息失败');
            navigate('/login');
            return;
          }
        }

        // else try cookie-based (backend set HttpOnly cookie)
        const res2 = await fetch(`${API_BASE}/api/users/me`, {
          credentials: 'include', // send cookie
        });
        if (res2.ok) {
          const json = await res2.json();
          // when backend returns { success:true, user }
          setUser(json.user || null);
          // It's possible backend didn't return token to frontend (cookie only)
          navigate('/dashboard');
        } else {
          message.error('OAuth 登录失败');
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
        message.error('OAuth 回调处理失败');
        navigate('/login');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>正在完成登录并跳转...</div>;
};

export default OAuthCallback;
