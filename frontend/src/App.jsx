import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Cpu } from 'lucide-react';

// Eager load HomePage for fast First Contentful Paint
import { HomePage } from './pages/HomePage';

// Lazy load secondary routes to optimize bundle size and time-to-interactive
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then(m => ({ default: m.DiscoverPage })));
const ControllersPage = lazy(() => import('./pages/ControllersPage').then(m => ({ default: m.ControllersPage })));
const LessonsPage = lazy(() => import('./pages/LessonsPage').then(m => ({ default: m.LessonsPage })));
const LabPage = lazy(() => import('./pages/LabPage').then(m => ({ default: m.LabPage })));
const QuizzesPage = lazy(() => import('./pages/QuizzesPage').then(m => ({ default: m.QuizzesPage })));
const ResearchNotesPage = lazy(() => import('./pages/ResearchNotesPage').then(m => ({ default: m.ResearchNotesPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AnatomyPage = lazy(() => import('./pages/AnatomyPage').then(m => ({ default: m.AnatomyPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const RoboticsPage = lazy(() => import('./pages/RoboticsPage').then(m => ({ default: m.RoboticsPage })));
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-[#655F55]">
      <Cpu className="w-8 h-8 text-[#D87535] animate-spin" />
      <span className="tracking-widest uppercase text-[#8C8275]">INITIALIZING SILICON RUNTIME...</span>
      <div className="flex gap-1 mt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D87535] animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#D87535] animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-[#D87535] animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/anatomy" element={<AnatomyPage />} />
              <Route path="/archive" element={<ControllersPage />} />
              <Route path="/archive/:slug" element={<ControllersPage />} />
              <Route path="/controllers" element={<ControllersPage />} />
              <Route path="/controllers/:slug" element={<ControllersPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/robotics" element={<RoboticsPage />} />
              <Route path="/experiment" element={<LabPage />} />
              <Route path="/lab" element={<LabPage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/:slug" element={<LessonsPage />} />
              <Route path="/quizzes" element={<QuizzesPage />} />
              <Route path="/quizzes/:chapterId" element={<QuizzesPage />} />
              <Route path="/research" element={<ResearchNotesPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
