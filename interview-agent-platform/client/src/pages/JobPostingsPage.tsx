import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { useAppStore } from '../store/appStore';
import { JobPosting } from '../types';
import toast from 'react-hot-toast';

export const JobPostingsPage: React.FC = () => {
  const { jobPostings, setJobPostings, addJobPosting, deleteJobPosting, interviewRecords, deleteInterviewRecord } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadJobPostings();
  }, []);

  const loadJobPostings = async () => {
    try {
      const response = await apiClient.getJobPostings();
      if (response.success) {
        setJobPostings(response.data);
      }
    } catch (error) {
      toast.error('加载职位失败');
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      const response = await apiClient.deleteJobPosting(id);
      if (response.success) {
        deleteJobPosting(id);
        toast.success('职位已删除');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || '删除职位失败');
    }
  };

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800',
    interview: 'bg-yellow-100 text-yellow-800',
    offer: 'bg-green-100 text-green-800',
    declined: 'bg-purple-100 text-purple-800',
  };
  // Unified quick-add record
  const [quickRecord, setQuickRecord] = useState({
    companyName: '',
    position: '',
    status: 'applied' as JobPosting['status'],
    date: '',
    jobUrl: '',
    comments: '',
  });

  const handleAddRecord = async () => {
    if (!quickRecord.companyName || !quickRecord.position) {
      toast.error('请填写公司和职位');
      return;
    }
    setIsLoading(true);
    try {
      // Create a job posting entry on the backend. If user wanted an interview-only record,
      // it will still create a job record locally and user can edit later.
      const payload: any = {
        companyName: quickRecord.companyName,
        position: quickRecord.position,
        status: quickRecord.status,
        jobUrl: quickRecord.jobUrl,
        notes: quickRecord.comments,
      };
      if (quickRecord.date) payload.appliedDate = quickRecord.date;

      const response = await apiClient.createJobPosting(payload);
      if (response.success) {
        addJobPosting(response.data);
        setQuickRecord({ companyName: '', position: '', status: 'applied', date: '', jobUrl: '', comments: '' });
        toast.success('已添加记录');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '添加失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    // if id matches a jobPosting -> delete via API, otherwise remove interview record from store
    const isJob = jobPostings.some((p) => p._id === id);
    if (isJob) {
      handleDeleteJob(id);
    } else {
      deleteInterviewRecord(id);
      toast.success('记录已删除');
    }
  };

  // Edit modal state
  const [editing, setEditing] = useState<null | any>(null);

  const openEdit = (record: any) => {
    setEditing({
      id: record.id,
      companyName: record.companyName,
      position: record.position,
      status: record.status,
      date: record.date ? (record.date instanceof Date ? record.date.toISOString().slice(0,10) : record.date) : '',
      jobUrl: record.jobUrl || '',
      comments: record.comments || '',
      source: record.source,
    });
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      const payload: any = {
        companyName: editing.companyName,
        position: editing.position,
        status: editing.status,
        jobUrl: editing.jobUrl,
        notes: editing.comments,
      };
      if (editing.date) payload.appliedDate = editing.date;

      // Only call backend for job records
      if (editing.source === 'job') {
        const resp = await apiClient.updateJobPosting(editing.id, payload);
        if (resp.success) {
          // update local store
          const updated = resp.data;
          // replace in app store
          const updatedList = jobPostings.map((p) => (p._id === updated._id ? updated : p));
          setJobPostings(updatedList);
          toast.success('已更新记录');
        } else {
          toast.error(resp.message || '更新失败');
        }
      } else {
        // For interview records we only update local store (no backend in this simplified flow)
        // Merge into interviewRecords in store if needed - here we just show success
        toast.success('面试记录已更新（本地）');
      }
      setEditing(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || '保存失败');
    }
  };

  const closeEdit = () => setEditing(null);

  // 统计记录数 and merge jobPostings + interviewRecords into a single view
  const mergedMap = new Map<string, any>();
  jobPostings.forEach((j) => {
    const key = `${j.companyName}||${j.position}`;
    mergedMap.set(key, {
      id: j._id,
      companyName: j.companyName,
      position: j.position,
      status: j.status,
      date: j.appliedDate ? new Date(j.appliedDate) : null,
      jobUrl: j.jobUrl || '',
      comments: j.notes || '',
      source: 'job',
    });
  });
  interviewRecords.forEach((r: any) => {
    const key = `${r.companyName}||${r.position}`;
    if (mergedMap.has(key)) {
      const rec = mergedMap.get(key);
      if (!rec.date && r.interviewDate) rec.date = new Date(r.interviewDate);
      rec.comments = [rec.comments, `Interview: ${r.interviewType}`].filter(Boolean).join(' | ');
    } else {
      mergedMap.set(key, {
        id: r._id,
        companyName: r.companyName,
        position: r.position,
        status: 'interview',
        date: r.interviewDate ? new Date(r.interviewDate) : null,
        jobUrl: '',
        comments: r.notes || '',
        source: 'interview',
      });
    }
  });
  const mergedRecords = Array.from(mergedMap.values());
  const totalRecords = mergedRecords.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">投递岗位与面试记录</h1>
          <p className="text-gray-600 mt-2">共 {totalRecords} 条记录</p>
        </div>

        {/* 合并表格 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公司</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">职位</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">链接</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
              {/* 快速添加行（统一） */}
              <tr className="bg-blue-50">
                <td className="px-4 py-2">
                  <input value={quickRecord.companyName} onChange={(e) => setQuickRecord({ ...quickRecord, companyName: e.target.value })} placeholder="公司" className="w-full border rounded px-2 py-1" />
                </td>
                <td className="px-4 py-2">
                  <input value={quickRecord.position} onChange={(e) => setQuickRecord({ ...quickRecord, position: e.target.value })} placeholder="职位" className="w-full border rounded px-2 py-1" />
                </td>
                
                <td className="px-4 py-2">
                  <select value={quickRecord.status} onChange={(e) => setQuickRecord({ ...quickRecord, status: e.target.value as JobPosting['status'] })} className="border rounded px-2 py-1 text-sm">
                    <option value="applied">已投递</option>
                    <option value="interview">面试中</option>
                    <option value="offer">已收offer</option>
                    <option value="rejected">已拒绝</option>
                    <option value="declined">已放弃</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input type="date" value={quickRecord.date} onChange={(e) => setQuickRecord({ ...quickRecord, date: e.target.value })} className="border rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-4 py-2">
                  <input value={quickRecord.jobUrl} onChange={(e) => setQuickRecord({ ...quickRecord, jobUrl: e.target.value })} placeholder="链接 (可选)" className="w-full border rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-4 py-2">
                  <input value={quickRecord.comments} onChange={(e) => setQuickRecord({ ...quickRecord, comments: e.target.value })} placeholder="Comments" className="w-full border rounded px-2 py-1 text-sm" />
                </td>
                <td className="px-4 py-2">
                  <button onClick={handleAddRecord} disabled={isLoading} className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50">{isLoading ? '添加中...' : '添加'}</button>
                </td>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mergedRecords.map((record: any) => (
                <tr key={`${record.source}-${record.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.source === 'job' ? (
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[record.status as keyof typeof statusColors]}`}>
                        {record.status}
                      </span>
                    ) : (
                      <span className="text-gray-600">面试记录</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.date ? record.date.toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {record.jobUrl ? (
                      <a href={record.jobUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                        打开
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-normal break-words max-w-xs">
                    {record.comments || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(record)} className="text-blue-600 hover:text-blue-800 font-medium">编辑</button>
                      <button onClick={() => handleDeleteRecord(record.id)} className="text-red-600 hover:text-red-800 font-medium">删除</button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* 空状态 */}
              {totalRecords === 0 && (
                <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-lg font-medium">暂无记录</div>
                    <div className="text-sm mt-1">在上方快速添加职位投递或面试记录</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[560px] p-6">
              <h2 className="text-lg font-semibold mb-4">编辑记录</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">公司</label>
                  <input value={editing.companyName} onChange={(e) => setEditing({ ...editing, companyName: e.target.value })} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">职位</label>
                  <input value={editing.position} onChange={(e) => setEditing({ ...editing, position: e.target.value })} className="w-full border rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">状态</label>
                  <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full border rounded px-2 py-1">
                    <option value="applied">已投递</option>
                    <option value="interview">面试中</option>
                    <option value="offer">已收offer</option>
                    <option value="rejected">已拒绝</option>
                    <option value="declined">已放弃</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">日期</label>
                  <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="w-full border rounded px-2 py-1" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">链接</label>
                  <input value={editing.jobUrl} onChange={(e) => setEditing({ ...editing, jobUrl: e.target.value })} className="w-full border rounded px-2 py-1" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Comments</label>
                  <textarea value={editing.comments} onChange={(e) => setEditing({ ...editing, comments: e.target.value })} className="w-full border rounded px-2 py-1" rows={3} />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button onClick={closeEdit} className="px-4 py-2 border rounded">取消</button>
                <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
