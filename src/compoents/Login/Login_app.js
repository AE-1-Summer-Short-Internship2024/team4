import React from 'react';
import AuthComponent from './components/AuthComponent'; // AuthComponentをインポート
import './Login_app.css'; // CSSファイルをインポート

const LoginApp = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">ログイン画面</h1>
      <AuthComponent />
    </div>
  );
};

export default LoginApp;
