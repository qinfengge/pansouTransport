import { BackendConfig, ApiLoginResponse, ApiSearchResponse } from '../types';

export const cleanUrl = (url: string) => url.replace(/\/$/, '');

export const AuthService = {
  login: async (baseUrl: string, username?: string, password?: string): Promise<string> => {
    if (!username || !password) throw new Error("用户名或密码为空");
    
    try {
      const response = await fetch(`${cleanUrl(baseUrl)}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data: ApiLoginResponse = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || '登录失败');
      }

      return data.token;
    } catch (error: any) {
      throw new Error(error.message || '连接服务器失败');
    }
  }
};

export const SearchService = {
  search: async (config: BackendConfig, keyword: string): Promise<ApiSearchResponse> => {
    const baseUrl = cleanUrl(config.serverUrl);
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (config.authType === 'basic' && config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    try {
      // Use parameter 'results' to get the flat list, 
      // but we need to handle if the API structure differs from expectations.
      const params = new URLSearchParams({
        kw: keyword,
        res: 'results', 
      });

      const response = await fetch(`${baseUrl}/api/search?${params.toString()}`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        throw new Error('未授权：请检查认证配置或重新测试连接以刷新令牌');
      }

      const rawData = await response.json();
      console.log('[API] Search Response:', rawData);

      // Normalize Response Logic
      let normalizedData: ApiSearchResponse = { total: 0, results: [] };

      if (Array.isArray(rawData)) {
        // Handle case where API returns array directly
        normalizedData.results = rawData;
        normalizedData.total = rawData.length;
      } else if (rawData.results && Array.isArray(rawData.results)) {
        // Standard documented case
        normalizedData = rawData;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        // Wrapper case: { data: [...] }
        normalizedData.results = rawData.data;
        normalizedData.total = rawData.data.length;
      } else if (rawData.data && rawData.data.results && Array.isArray(rawData.data.results)) {
        // Wrapper case: { data: { results: [...] } }
        normalizedData.results = rawData.data.results;
        normalizedData.total = rawData.total || rawData.data.results.length;
      }
      
      if (!response.ok || rawData.error) {
        throw new Error(rawData.error || rawData.message || `请求失败: ${response.status}`);
      }

      return normalizedData;
    } catch (error: any) {
      console.error('[API Error]', error);
      throw error;
    }
  }
};