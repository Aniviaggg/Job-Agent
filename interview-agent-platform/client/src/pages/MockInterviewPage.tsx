import React, { useState } from 'react';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';

export const MockInterviewPage: React.FC = () => {
  const [position, setPosition] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const { resumes } = useAppStore();
  const [selectedResumeId, setSelectedResumeId] = useState<string | undefined>(undefined);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [mockQuestions, setMockQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartMockInterview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!position) {
      toast.error('请输入职位');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.generateInterviewQuestions(position, undefined, selectedResumeId);
      if (response.success) {
        // 解析生成的问题
        const questionList = [response.data]; // 简化处理
        setMockQuestions(questionList);
        setAnswers(new Array(questionList.length).fill(''));
        setFeedbacks(new Array(questionList.length).fill(''));
        setIsStarted(true);
        setCurrentQuestionIndex(0);
        toast.success('模拟面试开始！');
      }
    } catch (error: any) {
      toast.error('启动模拟面试失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!userAnswer.trim()) {
      toast.error('请输入您的回答');
      return;
    }

    setIsGeneratingFeedback(true);

    try {
      const response = await apiClient.generateFeedback(
        mockQuestions[currentQuestionIndex],
        userAnswer
      );
      if (response.success) {
        setFeedback(response.data);
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = userAnswer;
        setAnswers(newAnswers);

        const newFeedbacks = [...feedbacks];
        newFeedbacks[currentQuestionIndex] = response.data;
        setFeedbacks(newFeedbacks);
      }
    } catch (error: any) {
      toast.error('生成反馈失败');
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(answers[currentQuestionIndex + 1] || '');
      setFeedback(feedbacks[currentQuestionIndex + 1] || '');
    } else {
      toast.success('模拟面试完成！');
      setIsStarted(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">模拟面试</h1>

            <form onSubmit={handleStartMockInterview} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  职位名称 *
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., 前端工程师"
                  required
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  难度等级
                </label>
                <div className="flex gap-4">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        value={level}
                        checked={difficulty === level}
                        onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                        className="mr-2"
                      />
                      <span className="text-gray-700">
                        {level === 'easy' ? '简单' : level === 'medium' ? '中等' : '困难'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {isLoading ? '准备中...' : '开始模拟面试'}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>提示：</strong>
                  模拟面试会根据职位生成问题，您可以逐个回答每个问题，系统会提供实时反馈。
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                问题 {currentQuestionIndex + 1} / {mockQuestions.length}
              </h1>
              <button
                onClick={() => setIsStarted(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">问题：</h2>
            <p className="text-gray-700 whitespace-pre-wrap break-words">
              {mockQuestions[currentQuestionIndex]}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              您的回答:
            </label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={6}
              placeholder="请输入您的回答..."
            />
          </div>

          {feedback && (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">🎯 AI反馈：</h3>
              <p className="text-green-800 whitespace-pre-wrap break-words">{feedback}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleGetFeedback}
              disabled={isGeneratingFeedback || !userAnswer.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isGeneratingFeedback ? '分析中...' : '获取反馈'}
            </button>

            {feedback && (
              <button
                onClick={handleNextQuestion}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {currentQuestionIndex < mockQuestions.length - 1 ? '下一题' : '完成'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
