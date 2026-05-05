import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const features = [
    {
      title: '投递岗位与面试记录',
      description: '管理投递的职位和面试进展',
      icon: '📋',
      path: '/job-postings',
      color: 'from-blue-400 to-blue-600',
    },
    {
      title: '简历管理与优化',
      description: '上传简历并获取AI优化建议',
      icon: '📄',
      path: '/resumes',
      color: 'from-green-400 to-green-600',
    },
    {
      title: '面试准备',
      description: '根据职位生成常见问题和指导',
      icon: '🎯',
      path: '/interview-prep',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: '模拟面试',
      description: '与AI进行真实场景的面试模拟',
      icon: '🎤',
      path: '/mock-interview',
      color: 'from-purple-400 to-purple-600',
    },
    {
      title: '职业规划',
      description: '获取个性化的职业发展建议',
      icon: '🚀',
      path: '/career-plan',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">面试准备平台</h1>
          <div className="text-right">
            <p className="text-gray-600">欢迎 {user?.name}</p>
            <button
              onClick={() => {
                useAuthStore.getState().logout();
                navigate('/login');
              }}
              className="text-red-500 hover:text-red-700 text-sm mt-1"
            >
              登出
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.path}
              onClick={() => navigate(feature.path)}
              className={`cursor-pointer rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition bg-gradient-to-br ${feature.color} text-white p-6`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
