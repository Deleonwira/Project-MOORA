import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { DataStoreProvider } from './contexts/DataStoreContext.jsx';
import { AppShell } from './components/layout/AppShell';
import { SplashScreen } from './components/splash/SplashScreen';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Step1Page } from './pages/Step1Page';
import { Step2Page } from './pages/Step2Page';
import { Step3Page } from './pages/Step3Page';
import { Step4Page } from './pages/Step4Page';
import { Step5Page } from './pages/Step5Page';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem('moora_splash_seen') !== '1';
    } catch {
      return true;
    }
  });

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataStoreProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/step/1" element={<Step1Page />} />
                <Route path="/step/2" element={<Step2Page />} />
                <Route path="/step/3" element={<Step3Page />} />
                <Route path="/step/4" element={<Step4Page />} />
                <Route path="/step/5" element={<Step5Page />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="*" element={<LandingPage />} />
              </Route>
            </Routes>
          </DataStoreProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
