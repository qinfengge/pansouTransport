import React from 'react';
import { Resource } from '../types';
import Icon from '../components/Icon';

interface DetailScreenProps {
  resource: Resource;
  onBack: () => void;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ resource, onBack }) => {
  const handleStartTransfer = () => {
    if (resource.shareLink) {
        window.open(resource.shareLink, '_blank');
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark shadow-xl overflow-hidden animate-fade-in">
      {/* Handle Bar (Visual only for sheet feel) */}
      <div className="flex flex-col items-center pt-3 pb-1 bg-background-light dark:bg-background-dark z-10">
        <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Header */}
      <div className="flex items-center px-4 py-2 justify-between bg-background-light dark:bg-background-dark z-10 sticky top-0">
        <button 
            onClick={onBack}
            className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
        >
          <Icon name="expand_more" />
        </button>
        <h2 className="text-slate-900 dark:text-white text-base font-bold tracking-tight">资源详情</h2>
        <button className="flex items-center justify-center p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-primary font-medium text-sm">
          <Icon name="more_horiz" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-32 no-scrollbar bg-background-light dark:bg-background-dark">
        {/* Preview Image */}
        <div className="px-5 pt-2 pb-6">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 group">
            <img 
                src={resource.posterUrl} 
                alt="Resource Preview" 
                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
              <Icon name="hd" size={14} className="text-white" />
              <span className="text-[10px] font-bold text-white tracking-wide">{resource.quality} {resource.tags[1] || ''}</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="px-6 pb-8">
          <h1 className="text-xl font-medium text-slate-900 dark:text-white leading-relaxed tracking-tight font-body">
            {resource.title}
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="px-5 pb-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 p-4 rounded-2xl bg-primary-soft dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="campaign" size={18} className="text-primary" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">来源</span>
              </div>
              <p className="text-slate-900 dark:text-slate-200 font-semibold text-sm truncate">tg:{resource.sourceName.toLowerCase()}</p>
            </div>
            <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="calendar_today" size={18} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">日期</span>
              </div>
              <p className="text-slate-900 dark:text-slate-200 font-semibold text-sm">2024-03-24</p>
            </div>
          </div>
        </div>

        {/* Access Info Card */}
        <div className="px-5 pb-6">
          <div className="p-5 rounded-3xl bg-surface-light dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-primary" />
                访问信息
              </h3>
              <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">有效</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-200 dark:shadow-none shrink-0">
                <Icon name="cloud" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">平台</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{resource.platform || '云盘'}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 mb-1.5 block">分享链接</label>
              <div className="flex items-center justify-between bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 p-3 rounded-xl group hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                   <Icon name="link" size={14} className="text-slate-400" />
                   <span className="truncate text-sm text-primary underline font-medium">{resource.shareLink || '链接已隐藏'}</span>
                </div>
                <Icon name="content_copy" size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>

            {resource.accessCode && (
                <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1 mb-1.5 block">提取码</label>
                <div className="flex items-center justify-between bg-white dark:bg-black/20 border border-slate-200 dark:border-slate-700 p-3 rounded-xl group hover:border-primary/50 transition-colors cursor-pointer w-full">
                    <div className="flex items-center gap-2">
                    <Icon name="lock" size={14} className="text-slate-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-200 font-mono font-bold tracking-widest">{resource.accessCode}</span>
                    </div>
                    <Icon name="content_copy" size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent dark:from-background-dark dark:via-background-dark/95 pb-8 pt-8 px-5 z-20 pointer-events-none">
        <button 
            onClick={handleStartTransfer}
            className="pointer-events-auto w-full h-14 bg-primary hover:bg-primary-dark active:scale-[0.98] transition-all rounded-full flex items-center justify-center gap-2 shadow-xl shadow-primary/30 group"
        >
           <Icon name="swap_vert" className="text-white" />
           <span className="text-white font-bold text-base tracking-wide">开始转存</span>
        </button>
      </div>
    </div>
  );
};

export default DetailScreen;