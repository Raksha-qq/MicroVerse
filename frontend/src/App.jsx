import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { HomePage } from './pages/HomePage';
import { ControllersPage } from './pages/ControllersPage';
import { LessonsPage } from './pages/LessonsPage';
import { LabPage } from './pages/LabPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { ResearchNotesPage } from './pages/ResearchNotesPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnatomyPage } from './pages/AnatomyPage';
import { ComparePage } from './pages/ComparePage';
import { RoboticsPage } from './pages/RoboticsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<HomePage />} />
            <Route path="/anatomy" element={<AnatomyPage />} />
            <Route path="/archive" element={<ControllersPage />} />
            <Route path="/controllers" element={<ControllersPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/robotics" element={<RoboticsPage />} />
            <Route path="/experiment" element={<LabPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/research" element={<ResearchNotesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
