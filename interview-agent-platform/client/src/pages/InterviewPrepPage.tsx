import React, { useState } from 'react';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';

export const InterviewPrepPage: React.FC = () => {
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const { resumes, interviewQuestions, setInterviewQuestions } = useAppStore();
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const parseInterviewQuestionBlocks = (raw: string) => {
    const cleaned = raw.replace(/```json|```/g, '').replace(/\r\n/g, '\n').trim();
    const headingMatches = cleaned.match(/^##\s.+$/gm);

    if (headingMatches && headingMatches.length > 0) {
      const blocks: string[] = [];
      const parts = cleaned.split(/(?=^##\s.+$)/m).map((part) => part.trim()).filter(Boolean);
      parts.forEach((part) => {
        blocks.push(part);
      });
      return blocks;
    }

    return cleaned
      .split(/\n\s*\n/)
      .map((q) => q.trim())
      .filter(Boolean);
  };

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) {
      toast.error('请输入职位');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.generateInterviewQuestions(position, company, selectedResumeId);
      if (response.success) {
        const raw = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        const parts = parseInterviewQuestionBlocks(raw);
        setInterviewQuestions(parts.length ? parts : [raw]);
        toast.success('问题已生成');
      }
    } catch (error: any) {
      toast.error('生成问题失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">面试准备</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 问题生成表单 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">生成面试问题</h2>
              <form onSubmit={handleGenerateQuestions} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    职位名称 *
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 前端工程师"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司名称 (可选)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 阿里巴巴"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择简历 (可选)</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value || undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">不使用</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.fileName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? '生成中...' : '生成问题'}
                </button>
              </form>
            </div>
          </div>

          {/* 问题列表 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">常见问题</h2>
              {interviewQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">请输入职位生成问题列表</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {interviewQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg"
                    >
                      <p className="font-semibold text-gray-900 break-words whitespace-pre-wrap">
                        {question}
                      </p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                          💡 <strong>小提示:</strong> 思考几个角度来回答这个问题
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
