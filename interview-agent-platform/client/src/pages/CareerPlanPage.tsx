import React, { useState } from 'react';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

export const CareerPlanPage: React.FC = () => {
  const [currentRole, setCurrentRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [careerPlan, setCareerPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentRole || !targetRole) {
      toast.error('请输入当前职位和目标职位');
      return;
    }

    setIsLoading(true);

    try {
      const skillsArray = currentSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);

      const response = await apiClient.generateCareerPlan(
        currentRole,
        targetRole,
        skillsArray
      );

      if (response.success) {
        setCareerPlan(response.data);
        toast.success('职业规划已生成');
      }
    } catch (error: any) {
      toast.error('生成职业规划失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">职业规划</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 输入表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">生成职业规划</h2>

              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前职位 *
                  </label>
                  <input
                    type="text"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., 初级前端工程师"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标职位 *
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., 高级前端工程师/架构师"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前技能 (逗号分隔，可选)
                  </label>
                  <input
                    type="text"
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., React, Vue, TypeScript"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
                >
                  {isLoading ? '生成中...' : '生成规划'}
                </button>
              </form>
            </div>
          </div>

          {/* 规划结果 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">职业发展路径</h2>

              {careerPlan ? (
                <div className="space-y-6">
                  <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                    <h3 className="font-bold text-pink-900 mb-2">📋 规划详情：</h3>
                    <div
                      className="text-sm text-pink-800 whitespace-pre-wrap break-words leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: careerPlan }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>💡 建议：</strong> 制定具体的时间表和里程碑
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-900">
                        <strong>✅ 行动：</strong> 开始学习新技能和知识
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    👈 输入您的职业信息以获取个性化规划
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
