import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import { Assessments } from './pages/Assessments';
import { Landing } from './pages/Landing';
import { Practice } from './pages/Practice';
import { Profile } from './pages/Profile';
import { Results } from './pages/Results';
import { Resources } from './pages/Resources';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/history" element={<DashboardLayout />}>
          <Route index element={<Resources />} />
        </Route>
        <Route path="/results" element={<DashboardLayout />}>
          <Route index element={<Results />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
