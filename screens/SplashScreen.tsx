import React, { useEffect } from 'react';
import Icon from '../components/Icon';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-background-light to-[#dbeafe] dark:from-background-dark dark:via-background-dark dark:to-[#0c131a] opacity-80 z-0" />
      
      {/* Abstract Shapes */}
      <div className="absolute -top-[20%] -right-[20%] w-[60vh] h-[60vh] rounded-full bg-primary/5 blur-3xl z-0" />
      <div className="absolute top-[40%] -left-[10%] w-[40vh] h-[40vh] rounded-full bg-primary/5 blur-3xl z-0" />

      <div className="flex-1" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-enter px-6 pb-20 animate-float-up">
        {/* Logo */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-xl bg-primary opacity-20 blur group-hover:opacity-40 transition duration-500" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#1a6bc0] text-white shadow-xl shadow-primary/20">
            <Icon name="cloud_upload" size={48} />
          </div>
        </div>

        {/* Text */}
        <div className="mt-8 text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#0d141b] dark:text-white font-display">
            CloudSync
          </h1>
          <p className="text-primary font-medium text-sm tracking-wide">
            快速 • 安全 • 智能
          </p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Footer */}
      <div className="relative z-10 w-full pb-10 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <p className="text-[#4c739a] dark:text-slate-500 text-xs font-normal tracking-widest uppercase opacity-80">
          AI 驱动
        </p>
        <div className="h-2" />
      </div>
    </div>
  );
};

export default SplashScreen;