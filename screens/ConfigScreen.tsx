import React from 'react';
import ConfigForm from '../components/ConfigForm';
import { BackendConfig } from '../types';
import Icon from '../components/Icon';

interface ConfigScreenProps {
  onBack: () => void;
  onSave: (config: BackendConfig) => void;
  hasPreviousConfig: boolean;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onBack, onSave, hasPreviousConfig }) => {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-4 pb-3 justify-between">
        {hasPreviousConfig ? (
            <button 
                onClick={onBack}
                className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white group active:scale-95"
            >
                <Icon name="arrow_back_ios_new" size={20} />
            </button>
        ) : <div className="size-10" />} {/* Spacer */}
        
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight text-center flex-1 pr-10">
            后端配置
        </h2>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 py-2 gap-8 animate-fade-in">
        <div className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-2">
            在下方配置您的实例连接详情。请根据您的服务器设置选择合适的认证方式。
        </div>

        <ConfigForm onSave={onSave} />
      </main>

      {/* Footer */}
      <div className="pb-6 flex justify-center opacity-30">
        <p className="text-[10px] font-mono tracking-widest uppercase">版本 v2.1.0 • 稳定版</p>
      </div>
    </div>
  );
};

export default ConfigScreen;