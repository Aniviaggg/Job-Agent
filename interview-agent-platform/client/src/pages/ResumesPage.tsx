import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { useAppStore } from '../store/appStore';
import toast from 'react-hot-toast';

export const ResumesPage: React.FC = () => {
  const { resumes, setResumes, addResume, deleteResume } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [targetPosition, setTargetPosition] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    if (resumes.length === 0) {
      setSelectedResumeId('');
      return;
    }

    const selectedResume = resumes.find((resume) => resume._id === selectedResumeId);
    const preferredResume =
      resumes.find((resume) => resume.isPrimary && resume.content) ||
      resumes.find((resume) => resume.content) ||
      resumes[0];

    if (!selectedResume || !selectedResume.content) {
      setSelectedResumeId(preferredResume?._id || '');
    }
  }, [resumes, selectedResumeId]);

  const loadResumes = async () => {
    try {
      const response = await apiClient.getResumes();
      if (response.success) {
        setResumes(response.data);
      }
    } catch (error) {
      toast.error('加载简历失败');
    }
  };

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('请先选择已上传的简历');
      return;
    }
    setIsLoading(true);

    try {
      const response = await apiClient.optimizeResume({ resumeId: selectedResumeId, targetPosition });
      if (response.success) {
        setAiSuggestions(response.data);
        toast.success('优化建议已生成');
      }
    } catch (error: any) {
      toast.error('生成优化建议失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const response = await apiClient.setPrimaryResume(id);
      if (response.success) {
        loadResumes();
        toast.success('已设置为主简历');
      }
    } catch (error: any) {
      toast.error('设置失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await apiClient.deleteResume(id);
      if (response.success) {
        deleteResume(id);
        toast.success('简历已删除');
      }
    } catch (error: any) {
      toast.error('删除失败');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">简历管理与优化</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 简历列表 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">我的简历</h2>
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">暂无简历</p>
                </div>
              ) : (
                resumes.map((resume) => (
                  <div key={resume._id} className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{resume.fileName}</h3>
                        <p className="text-sm text-gray-500">
                          大小: {(resume.fileSize / 1024).toFixed(2)} KB
                        </p>
                        {resume.isPrimary && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            主简历
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!resume.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(resume._id)}
                            className="text-blue-500 hover:text-blue-700 text-sm"
                          >
                            设为主
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(resume._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {showUploadForm ? '取消' : '上传简历'}
            </button>

            {showUploadForm && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                <p className="text-sm text-gray-600 mb-4">支持上传 PDF 简历（最大 10MB）。上传后会自动提取内容供 AI 使用。</p>
                <div className="mb-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!selectedFile) return toast.error('请选择文件');
                      setIsLoading(true);
                      try {
                        const form = new FormData();
                        form.append('file', selectedFile);
                        const response = await apiClient.uploadResume(form);
                        if (response.success) {
                          addResume(response.data);
                          setShowUploadForm(false);
                          toast.success('简历上传成功');
                          loadResumes();
                        }
                      } catch (err) {
                        toast.error('上传失败');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    {isLoading ? '上传中...' : '上传 PDF'}
                  </button>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 优化建议 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">AI 优化建议</h2>
            <form onSubmit={handleOptimize} className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择已上传的简历
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">请选择简历</option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.fileName}{resume.isPrimary ? '（主简历）' : ''}
                    </option>
                  ))}
                </select>
                {resumes.length === 0 && (
                  <p className="mt-2 text-sm text-orange-600">暂无可用简历，请先上传 PDF 简历。</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标职位 (可选)
                </label>
                <input
                  type="text"
                  value={targetPosition}
                  onChange={(e) => setTargetPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 前端工程师"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || resumes.length === 0}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? '生成中...' : '获取优化建议'}
              </button>

              {aiSuggestions && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">优化建议：</h4>
                  <div
                    className="text-sm text-gray-700 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: aiSuggestions }}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
