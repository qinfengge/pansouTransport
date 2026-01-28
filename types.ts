export interface Resource {
  id: string;
  title: string;
  year: number;
  quality: string; // e.g., "4K", "1080p"
  tags: string[]; // e.g., ["HDR", "Remux"]
  size: string;
  sourceCount: number;
  sourceName: string;
  date: string;
  posterUrl: string;
  type: 'movie' | 'series' | 'doc';
  description?: string;
  platform?: string;
  shareLink?: string;
  accessCode?: string;
  saved?: boolean;
}

export interface BackendConfig {
  serverUrl: string;
  authType: 'none' | 'basic';
  username?: string;
  password?: string;
  token?: string; // Store JWT token
}

export enum AppRoute {
  SPLASH = '/',
  CONFIG = '/config',
  SEARCH = '/search',
  DETAILS = '/details/:id',
}

export interface IconProps {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
}

// API Response Types
export interface ApiLoginResponse {
  token: string;
  expires_at: number;
  username: string;
  error?: string;
}

export interface ApiLink {
  type: string;
  url: string;
  password?: string;
  work_title?: string;
}

export interface ApiSearchResultItem {
  message_id: string;
  unique_id: string;
  channel: string;
  datetime: string;
  title: string;
  content: string;
  links: ApiLink[];
  tags?: string[];
  images?: string[];
}

export interface ApiSearchResponse {
  total: number;
  results: ApiSearchResultItem[];
  error?: string;
  code?: string | number;
}