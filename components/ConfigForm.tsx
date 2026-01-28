import React, { useState } from 'react';
import { BackendConfig } from '../types';
import { AuthService, SearchService } from '../services/api';
import Icon from './Icon';

interface ConfigFormProps {
  initialConfig?: BackendConfig;
  onSave: (config: BackendConfig) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ initialConfig, onSave }) => {
  const [serverUrl, setServerUrl] = useState(initialConfig?.serverUrl || '');
  const [authType, setAuthType] = useState<'none' | 'basic'>(initialConfig?.authType || 'none');
  const [username, setUsername] = useState(initialConfig?.username || '');
  const [password, setPassword] = useState(initialConfig?.password || '');
  const [token, setToken] = useState(initialConfig?.token || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // New state for visual feedback
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const getTempConfig = (tempToken?: string): BackendConfig => ({
    serverUrl,
    authType,
    username,
    password,
    token: tempToken || token
  });

  const handleTest = async () => {
    setTestResult(null);
    if (!serverUrl) {
      setTestResult({ success: false, message: "请输入服务器地址" });
      return;
    }

    setIsTesting(true);
    let currentToken = token;

    try {
      // Step 1: Handle Authentication if Basic
      if (authType === 'basic') {
        try {
          currentToken = await AuthService.login(serverUrl, username, password);
          setToken(currentToken);
        } catch (e: any) {
          throw new Error(`认证失败: ${e.message}`);
        }
      }

      // Step 2: Test Search API
      const testConfig = getTempConfig(currentToken);
      const data = await SearchService.search(testConfig, '极限挑战');

      // Verify parsing
      const count = data.results ? data.results.length : 0;
      setTestResult({ 
        success: true, 
        message: `连接成功！认证有效。解析到 ${count} 条测试结果。` 
      });

    } catch (error: any) {
      console.error("Test failed:", error);
      setTestResult({ 
        success: false, 
        message: `连接失败: ${error.message}` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!serverUrl) {
         setTestResult({ success: false, message: "服务器地址不能为空" });
         return;
    }
    if (authType === 'basic' && (!username || !password)) {
        setTestResult({ success: false, message: "请填写用户名和密码" });
        return;
    }
    
    onSave({ 
        serverUrl, 
        authType,
        username: authType === 'basic' ? username : undefined,
        password: authType === 'basic' ? password : undefined,
        token: authType === 'basic' ? token : undefined
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Server Address */}
      <div className="group/input flex flex-col gap-2">
        <label htmlFor="server-url" className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-normal ml-1 flex items-center gap-2">
          服务器地址
        </label>
        <div className="relative transition-all duration-300 group-focus-within/input:scale-[1.01]">
          <input
            id="server-url"
            type="url"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="http://localhost:8888"
            className="peer form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 pr-10 text-base font-medium leading-normal transition-all duration-200 shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-primary transition-colors pointer-events-none">
            <Icon name="dns" size={20} />
          </div>
        </div>
      </div>

      {/* Auth Type Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-normal ml-1">
          认证方式
        </label>
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={() => setAuthType('none')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    authType === 'none' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary/50'
                }`}
            >
                <Icon name="no_accounts" size={28} filled={authType === 'none'} />
                <span className="text-sm font-bold">无认证</span>
            </button>
            <button
                onClick={() => setAuthType('basic')}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    authType === 'basic' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-primary/50'
                }`}
            >
                <Icon name="password" size={28} filled={authType === 'basic'} />
                <span className="text-sm font-bold">账号密码</span>
            </button>
        </div>
      </div>

      {/* Credentials Inputs */}
      {authType === 'basic' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="group/input flex flex-col gap-2">
                <label htmlFor="username" className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-normal ml-1">用户名</label>
                <div className="relative transition-all duration-300 group-focus-within/input:scale-[1.01]">
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="peer form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 px-4 pr-10 text-base font-medium leading-normal transition-all duration-200 shadow-sm"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 peer-focus:text-primary transition-colors pointer-events-none">
                    <Icon name="person" size={20} />
                </div>
                </div>
            </div>

            <div className="group/input flex flex-col gap-2">
                <label htmlFor="password" className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-normal ml-1">密码</label>
                <div className="relative flex w-full items-center transition-all duration-300 group-focus-within/input:scale-[1.01]">
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="peer form-input flex w-full min-w-0 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-white focus:outline-0 focus:ring-4 focus:ring-primary/10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-primary dark:focus:border-primary h-14 placeholder:text-slate-400 dark:placeholder:text-slate-600 pl-4 pr-12 text-base font-medium leading-normal transition-all duration-200 shadow-sm"
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-4 text-slate-400 hover:text-primary transition-colors flex items-center justify-center cursor-pointer outline-none focus:text-primary"
                >
                    <Icon name={showPassword ? "visibility" : "visibility_off"} size={20} />
                </button>
                </div>
            </div>
            
            <p className="text-xs text-slate-400 dark:text-slate-500 px-1">
                * 保存前建议先点击测试连接，以获取最新的认证令牌。
            </p>
          </div>
      )}

      {/* Feedback Message */}
      {testResult && (
        <div className={`p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-fade-in ${
            testResult.success 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800'
        }`}>
            <Icon name={testResult.success ? "check_circle" : "error"} size={20} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed break-all">{testResult.message}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="group relative flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-background-light dark:bg-slate-800 border-2 border-primary/20 hover:border-primary/40 text-primary dark:text-blue-300 text-base font-bold leading-normal transition-all duration-200 active:scale-[0.98]"
        >
          <span className={`mr-2 transition-transform ${isTesting ? 'animate-spin' : 'group-hover:rotate-45'}`}>
             <Icon name="sync_alt" size={20} />
          </span>
          <span className="truncate">{isTesting ? '正在连接...' : '测试连接'}</span>
        </button>
        <button
          onClick={handleSave}
          className="group flex w-full cursor-pointer items-center justify-center rounded-xl h-14 px-5 bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 text-base font-bold leading-normal transition-all duration-200 active:scale-[0.98]"
        >
          <Icon name="check" size={20} className="mr-2" />
          <span className="truncate">保存配置</span>
        </button>
      </div>
    </div>
  );
};

export default ConfigForm;