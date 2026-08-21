import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { AuthLayout } from '../layout/AuthLayout';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';
import { Skeleton } from '../components/Skeleton';

const Login = lazy(() => import('../pages/Login/Login').then((m) => ({ default: m.Login })));
const SignUp = lazy(() => import('../pages/Login/SignUp').then((m) => ({ default: m.SignUp })));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Board = lazy(() => import('../pages/Board/Board').then((m) => ({ default: m.Board })));
const Analytics = lazy(() => import('../pages/Analytics/Analytics').then((m) => ({ default: m.Analytics })));

const PageFallback = () => (
  <div className="space-y-6 p-4">
    <Skeleton className="h-24 w-full rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <Skeleton className="h-80 w-full rounded-2xl" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public auth routes (Authenticated users redirected to /dashboard) */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
        </Route>

        {/* Protected Dashboard, Board, Analytics routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board" element={<Board />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Fallback root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};
