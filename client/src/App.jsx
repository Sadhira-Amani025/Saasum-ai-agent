import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import PromptPanel from './components/PromptPanel';
import PreviewPanel from './components/PreviewPanel';
import ApiKeyModal from './components/ApiKeyModal';
import { fetchServerStatus, generateWebsite, modifyWebsite } from './services/api';
import { downloadZip, openInNewTab } from './utils/exportZip';

export default function App() {
  // AI Status
  const [apiStatus, setApiStatus] = useState({
    configured: false,
    provider: null,
    model: null,
    message: 'Checking status...',
  });
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Generation & Version State
  const [htmlContent, setHtmlContent] = useState('');
  const [versions, setVersions] = useState([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);

  // View Controls
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'code'
  const [deviceViewport, setDeviceViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const loadingIntervalRef = useRef(null);

  // Check API configuration on mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await fetchServerStatus();
      setApiStatus(status);
    } catch (err) {
      setApiStatus({
        configured: false,
        provider: null,
        model: null,
        message: 'Could not reach server',
      });
    }
  };

  const startLoadingAnimation = (type = 'generate') => {
    setIsLoading(true);
    setErrorMessage(null);

    const messages =
      type === 'generate'
        ? [
            'Analyzing your prompt requirements...',
            'Designing responsive layout & sections...',
            'Injecting modern Tailwind styles & gradients...',
            'Adding interactive scripts & components...',
            'Polishing standalone HTML5 preview...',
          ]
        : [
            'Inspecting current website structure...',
            'Applying requested modifications...',
            'Refining styles & preserving layout...',
            'Rebuilding standalone HTML5 page...',
          ];

    let step = 0;
    setLoadingMessage(messages[0]);

    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = setInterval(() => {
      step = (step + 1) % messages.length;
      setLoadingMessage(messages[step]);
    }, 2800);
  };

  const stopLoadingAnimation = () => {
    setIsLoading(false);
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  // Generate a brand new website
  const handleGenerate = async (prompt) => {
    startLoadingAnimation('generate');
    try {
      const data = await generateWebsite(prompt);
      const newVersion = {
        html: data.html,
        prompt: prompt,
        timestamp: new Date(),
        type: 'generate',
      };

      setVersions([newVersion]);
      setCurrentVersionIndex(0);
      setHtmlContent(data.html);
      setViewMode('preview');
      setErrorMessage(null);
    } catch (error) {
      console.error('Generation error:', error);
      setErrorMessage(error.message);
      if (error.code === 'MISSING_API_KEY' || !apiStatus.configured) {
        setIsSetupModalOpen(true);
      }
    } finally {
      stopLoadingAnimation();
    }
  };

  // Modify current website
  const handleModify = async (prompt) => {
    if (!htmlContent) return;
    startLoadingAnimation('modify');
    try {
      const data = await modifyWebsite(prompt, htmlContent);
      const newVersion = {
        html: data.html,
        prompt: prompt,
        timestamp: new Date(),
        type: 'modify',
      };

      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);
      setCurrentVersionIndex(updatedVersions.length - 1);
      setHtmlContent(data.html);
      setViewMode('preview');
      setErrorMessage(null);
    } catch (error) {
      console.error('Modification error:', error);
      setErrorMessage(error.message);
      if (error.code === 'MISSING_API_KEY' || !apiStatus.configured) {
        setIsSetupModalOpen(true);
      }
    } finally {
      stopLoadingAnimation();
    }
  };

  // Select historical version
  const handleSelectVersion = (index) => {
    if (versions[index]) {
      setCurrentVersionIndex(index);
      setHtmlContent(versions[index].html);
    }
  };

  const handleReset = () => {
    setHtmlContent('');
    setVersions([]);
    setCurrentVersionIndex(0);
    setErrorMessage(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <Header
        apiStatus={apiStatus}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        deviceViewport={deviceViewport}
        setDeviceViewport={setDeviceViewport}
        hasGeneratedWebsite={!!htmlContent}
        onDownloadZip={() => downloadZip(htmlContent)}
        onOpenInNewTab={() => openInNewTab(htmlContent)}
        onReset={handleReset}
      />

      {/* Main Split Body: Left Prompt Panel + Right Live Sandbox */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <PromptPanel
          onGenerate={handleGenerate}
          onModify={handleModify}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          errorMessage={errorMessage}
          hasGeneratedWebsite={!!htmlContent}
          versions={versions}
          currentVersionIndex={currentVersionIndex}
          onSelectVersion={handleSelectVersion}
          onOpenSetupModal={() => setIsSetupModalOpen(true)}
        />

        <PreviewPanel
          htmlContent={htmlContent}
          viewMode={viewMode}
          setViewMode={setViewMode}
          deviceViewport={deviceViewport}
          setDeviceViewport={setDeviceViewport}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          onOpenSetupModal={() => setIsSetupModalOpen(true)}
          apiStatus={apiStatus}
        />
      </div>

      {/* API Setup & Guidance Modal */}
      <ApiKeyModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        apiStatus={apiStatus}
        onRefreshStatus={checkStatus}
      />
    </div>
  );
}
