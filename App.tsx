import React, { useState, useEffect } from 'react';
import { BackendConfig, Resource } from './types';
import SplashScreen from './screens/SplashScreen';
import ConfigScreen from './screens/ConfigScreen';
import SearchScreen from './screens/SearchScreen';
import DetailScreen from './screens/DetailScreen';

enum Screen {
  SPLASH,
  CONFIG,
  SEARCH,
  DETAILS
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [config, setConfig] = useState<BackendConfig | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Cache state for search screen
  const [cachedSearchTerm, setCachedSearchTerm] = useState('沙丘');
  const [cachedResources, setCachedResources] = useState<Resource[]>([]);

  // Load config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('cloud_sync_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSplashComplete = () => {
    if (config) {
      setCurrentScreen(Screen.SEARCH);
    } else {
      setCurrentScreen(Screen.CONFIG);
    }
  };

  const handleConfigSave = (newConfig: BackendConfig) => {
    setConfig(newConfig);
    localStorage.setItem('cloud_sync_config', JSON.stringify(newConfig));
    setCurrentScreen(Screen.SEARCH);
  };

  const handleNavigateDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setCurrentScreen(Screen.DETAILS);
  };

  const handleCacheUpdate = (term: string, resources: Resource[]) => {
    setCachedSearchTerm(term);
    setCachedResources(resources);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;
      case Screen.CONFIG:
        return (
          <ConfigScreen 
            onBack={() => setCurrentScreen(Screen.SEARCH)} 
            onSave={handleConfigSave} 
            hasPreviousConfig={!!config} 
          />
        );
      case Screen.SEARCH:
        return (
          <SearchScreen 
            onNavigateDetails={handleNavigateDetails} 
            onOpenConfig={() => setCurrentScreen(Screen.CONFIG)}
            initialSearchTerm={cachedSearchTerm}
            initialResources={cachedResources}
            onCacheUpdate={handleCacheUpdate}
          />
        );
      case Screen.DETAILS:
        return selectedResource ? (
          <DetailScreen 
            resource={selectedResource} 
            onBack={() => setCurrentScreen(Screen.SEARCH)} 
          />
        ) : null;
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-black">
        {/* Simple centering wrapper for desktop view to mimic mobile app */}
        <div className="w-full h-full flex justify-center bg-gray-900">
            {renderScreen()}
        </div>
    </div>
  );
};

export default App;