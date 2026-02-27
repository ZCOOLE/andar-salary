import { createBrowserRouter, redirect } from 'react-router';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { PerformancePage } from './components/PerformancePage';
import { SelfEvaluatePage } from './components/SelfEvaluatePage';
import { BatchAssessPage } from './components/BatchAssessPage';
import { AssessListPage } from './components/AssessListPage';
import { AssessDetailPage } from './components/AssessDetailPage';
import { SalaryPage } from './components/SalaryPage';
import { SalaryDetailPage } from './components/SalaryDetailPage';
import { ProfilePage } from './components/ProfilePage';
import { NotFoundPage } from './components/NotFoundPage';
import { isAuthenticated } from './lib/auth';

// 路由守卫
const authLoader = () => {
  if (!isAuthenticated()) {
    return redirect('/login');
  }
  return null;
};

const loginLoader = () => {
  if (isAuthenticated()) {
    return redirect('/');
  }
  return null;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
    loader: loginLoader,
  },
  {
    path: '/',
    Component: Layout,
    loader: authLoader,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'performance',
        Component: PerformancePage,
      },
      {
        path: 'performance/self-evaluate',
        Component: SelfEvaluatePage,
      },
      {
        path: 'performance/batch-assess',
        Component: BatchAssessPage,
      },
      {
        path: 'performance/assess-list',
        Component: AssessListPage,
      },
      {
        path: 'performance/assess/:id',
        Component: AssessDetailPage,
      },
      {
        path: 'salary',
        Component: SalaryPage,
      },
      {
        path: 'salary/:id',
        Component: SalaryDetailPage,
      },
      {
        path: 'profile',
        Component: ProfilePage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
]);