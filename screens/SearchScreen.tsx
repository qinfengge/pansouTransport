import React, { useState, useEffect, useRef } from 'react';
import { Resource, BackendConfig, ApiSearchResultItem } from '../types';
import { SEARCH_FILTERS } from '../constants';
import { SearchService } from '../services/api';
import ResourceCard from '../components/ResourceCard';
import Icon from '../components/Icon';

interface SearchScreenProps {
  onNavigateDetails: (resource: Resource) => void;
  onOpenConfig: () => void;
  initialSearchTerm: string;
  initialResources: Resource[];
  onCacheUpdate: (term: string, resources: Resource[]) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ 
    onNavigateDetails, 
    onOpenConfig,
    initialSearchTerm,
    initialResources,
    onCacheUpdate
}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Draggable tabs refs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const formatDate = (dateString: string) => {
    if (!dateString) return '近日';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; 
      
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 1) return '今天';
      if (diffDays <= 2) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getPlatformName = (type: string) => {
      const map: Record<string, string> = {
          'baidu': '百度网盘',
          'aliyun': '阿里云盘',
          'quark': '夸克网盘',
          'tianyi': '天翼云盘',
          'uc': 'UC网盘',
          'mobile': '移动云盘',
          '115': '115网盘',
          'pikpak': 'PikPak',
          'xunlei': '⚡迅雷网盘',
          '123': '🎯 123网盘',
          'magnet': '🧲 磁力链接',
          'ed2k': '🔗 电驴链接'
      };
      return map[type] || '云盘';
  };

  const mapApiToResource = (item: ApiSearchResultItem): Resource => {
    const links = item.links || [];
    const mainLink = links.length > 0 ? links[0] : null;
    const safeId = item.unique_id || item.message_id || `temp-${Math.random().toString(36).substr(2, 9)}`;
    const platformType = mainLink?.type || 'unknown';
    const platformName = getPlatformName(platformType);

    return {
      id: safeId,
      title: item.title || mainLink?.work_title || '无标题资源',
      year: item.datetime ? new Date(item.datetime).getFullYear() : new Date().getFullYear(),
      quality: (item.tags?.find(t => t.toUpperCase().includes('K') || t.toUpperCase().includes('P')) || 'HD'),
      tags: item.tags || [],
      size: '未知', 
      sourceCount: links.length,
      sourceName: item.channel || '未知来源',
      date: formatDate(item.datetime),
      posterUrl: (item.images && item.images.length > 0) ? item.images[0] : 'https://via.placeholder.com/200x300?text=No+Image',
      type: 'movie', 
      description: item.content || '暂无描述',
      platform: platformName,
      shareLink: mainLink?.url || '',
      accessCode: mainLink?.password,
      saved: false,
    };
  };

  const performSearch = async (kw: string) => {
    const savedConfigStr = localStorage.getItem('cloud_sync_config');
    if (!savedConfigStr) {
        setError("未找到服务器配置");
        return;
    }

    setLoading(true);
    setError('');

    try {
        const config: BackendConfig = JSON.parse(savedConfigStr);
        console.log('[Search] Searching for:', kw);
        const data = await SearchService.search(config, kw);
        
        if (data.results && Array.isArray(data.results)) {
            let mapped = data.results.map(mapApiToResource);
            
            // Sort: Items with valid images first
            mapped.sort((a, b) => {
                const aHasImg = a.posterUrl && !a.posterUrl.includes('placeholder') && !a.posterUrl.includes('No+Image');
                const bHasImg = b.posterUrl && !b.posterUrl.includes('placeholder') && !b.posterUrl.includes('No+Image');
                if (aHasImg && !bHasImg) return -1;
                if (!aHasImg && bHasImg) return 1;
                return 0;
            });

            setResources(mapped);
            onCacheUpdate(kw, mapped);
        } else {
            setResources([]);
            onCacheUpdate(kw, []);
        }
    } catch (err: any) {
        console.error('[Search Error]', err);
        setError(err.message || '搜索请求失败');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm === initialSearchTerm && resources.length > 0) {
        return;
    }
    if (searchTerm) {
        const timer = setTimeout(() => {
            performSearch(searchTerm);
        }, 800); 
        return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const handleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const resource = resources.find(r => r.id === id);
    if (!resource) return;

    // Optimistic UI update
    const newResources = resources.map(r => r.id === id ? { ...r, saved: true } : r);
    setResources(newResources);
    onCacheUpdate(searchTerm, newResources);

    // Try to open app
    if (resource.shareLink) {
        window.open(resource.shareLink, '_blank');
    }
  };

  const checkPlatform = (resource: Resource, filterId: string) => {
    const p = resource.platform?.toLowerCase() || '';
    if (filterId === 'all') return true;
    if (filterId === 'baidu' && p.includes('百度')) return true;
    if (filterId === 'aliyun' && p.includes('阿里')) return true;
    if (filterId === 'quark' && p.includes('夸克')) return true;
    if (filterId === 'tianyi' && p.includes('天翼')) return true;
    if (filterId === 'uc' && p.includes('uc')) return true;
    if (filterId === 'mobile' && p.includes('移动')) return true;
    if (filterId === '115' && p.includes('115')) return true;
    if (filterId === 'pikpak' && p.includes('pikpak')) return true;
    if (filterId === 'xunlei' && p.includes('迅雷')) return true;
    if (filterId === '123' && p.includes('123')) return true;
    if (filterId === 'magnet' && p.includes('磁力')) return true;
    if (filterId === 'ed2k' && p.includes('电驴')) return true;
    return false;
  };

  // Filter logic
  const filteredResources = activeFilter === 'all' 
    ? resources 
    : resources.filter(r => checkPlatform(r, activeFilter));

  // Draggable Tabs Logic
  const handleMouseDown = (e: React.MouseEvent) => {
      if (!tabsContainerRef.current) return;
      setIsDragging(true);
      setStartX(e.pageX - tabsContainerRef.current.offsetLeft);
      setScrollLeft(tabsContainerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => { setIsDragging(false); };
  const handleMouseUp = () => { setIsDragging(false); };
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !tabsContainerRef.current) return;
      e.preventDefault();
      const x = e.pageX - tabsContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      tabsContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl border-x border-slate-200 dark:border-slate-800">
      <div className="h-12 w-full bg-background-light dark:bg-background-dark sticky top-0 z-30 opacity-95" />

      <div className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 pb-2 pt-2">
          <div className="flex items-center gap-3">
            <button onClick={onOpenConfig} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
              <Icon name="settings" size={24} />
            </button>
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Icon name="search" className="text-primary" size={20} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索电影、剧集..."
                className="block w-full rounded-2xl border-none bg-white dark:bg-surface-dark shadow-sm py-3.5 pl-11 pr-10 text-sm leading-5 placeholder-slate-400 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                     <Icon name="cancel" size={20} filled />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pt-1">
          <div 
            ref={tabsContainerRef}
            className="flex gap-2 overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {SEARCH_FILTERS.map((filter) => {
              const count = resources.filter(r => checkPlatform(r, filter.id)).length;
              return (
                <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shrink-0 transition-transform active:scale-95 border ${
                        activeFilter === filter.id
                        ? 'bg-primary text-white shadow-sm shadow-primary/30 border-transparent'
                        : 'bg-white dark:bg-surface-dark text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                    {filter.icon && <Icon name={filter.icon} size={18} className={filter.rotateIcon ? 'rotate-45' : ''} />}
                    <span className={`font-medium text-sm ${activeFilter === filter.id ? 'font-bold' : ''}`}>
                        {filter.label} {count > 0 ? `(${count})` : ''}
                    </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 bg-background-light dark:bg-background-dark no-scrollbar">
        <div className="flex justify-between items-end px-1 pb-1">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">搜索结果</h2>
            <p className="text-xs text-slate-500 mt-0.5">
                {loading ? '正在搜索...' : `找到 ${filteredResources.length} 个资源`}
            </p>
          </div>
        </div>

        {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
            </div>
        )}

        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="animate-spin text-primary mb-2"><Icon name="sync" size={32} /></div>
                <p className="text-sm text-slate-500">正在从聚合源获取数据...</p>
             </div>
        ) : filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
                <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onClick={() => onNavigateDetails(resource)}
                    onSave={(e) => handleSave(e, resource.id)}
                />
            ))
        ) : !error && (
            <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Icon name="search_off" size={48} className="text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">
                    {activeFilter !== 'all' ? `没有找到 ${activeFilter} 平台的资源` : '未找到相关资源'}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;