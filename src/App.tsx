import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TabBar } from './components/TabBar';
import { ToastHost } from './components/ToastHost';
import Farm from './pages/Farm';
import Shop from './pages/Shop';
import Warehouse from './pages/Warehouse';
import Friends from './pages/Friends';
import Profile from './pages/Profile';

/**
 * 应用外壳
 * - HashRouter：兼容 PWA 离线场景（不依赖服务端 rewrite）
 * - 五个主 Tab 页 + 底部导航 + 全局 Toast
 */
export default function App() {
  return (
    <HashRouter>
      <div className="farm-shell">
        <Routes>
          <Route path="/" element={<Farm />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <TabBar />
        <ToastHost />
      </div>
    </HashRouter>
  );
}
