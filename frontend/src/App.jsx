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
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/controllers" element={<ControllersPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lab" element={<LabPage />} />
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
