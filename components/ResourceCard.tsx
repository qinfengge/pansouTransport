import React from 'react';
import { Resource } from '../types';
import Icon from './Icon';

interface ResourceCardProps {
  resource: Resource;
  onClick: () => void;
  onSave: (e: React.MouseEvent) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick, onSave }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white dark:bg-surface-dark rounded-2xl p-3 shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200 dark:border-slate-700 flex gap-4 hover:border-primary/30 transition-all duration-200 cursor-pointer ${resource.saved ? 'opacity-80' : ''}`}
    >
      {/* Poster */}
      <div className="relative shrink-0 w-[100px] h-[140px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${resource.posterUrl}')` }}
        />
        {resource.saved && (
           <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
             <Icon name="check_circle" size={32} className="text-white drop-shadow-md" filled />
           </div>
        )}
        <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
          <Icon name={resource.type === 'movie' ? 'hd' : (resource.type === 'series' ? 'subtitles' : 'videocam')} size={10} />
          {resource.quality}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div>
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
            {resource.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
               <Icon name="folder_zip" size={12} /> {resource.size}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                resource.platform?.includes('115') 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : resource.platform?.includes('Quark') || resource.platform?.includes('夸克')
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
              }`}>
               <Icon name={resource.platform?.includes('115') ? 'cloud' : (resource.platform?.includes('Quark') || resource.platform?.includes('夸克') ? 'flight' : 'bolt')} className={resource.platform?.includes('Quark') || resource.platform?.includes('夸克') ? 'rotate-45' : ''} size={12} />
               {resource.sourceCount}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <Icon name="schedule" size={14} /> {resource.date}
            <span>•</span>
            <span className="truncate">来源：{resource.sourceName}</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onSave}
          disabled={resource.saved}
          className={`w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-colors active:scale-[0.98]
            ${resource.saved 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            }`}
        >
          <Icon name={resource.saved ? 'check' : 'cloud_upload'} size={18} />
          {resource.saved ? '已保存' : '保存到云端'}
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;