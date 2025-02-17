import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';

const UrlAnalyzer = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!FirecrawlService.getApiKey());
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    const isValid = await FirecrawlService.testApiKey(apiKey);
    if (isValid) {
      FirecrawlService.saveApiKey(apiKey);
      setShowApiKeyInput(false);
      toast({
        title: "Success",
        description: "API key saved successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Invalid API key",
        variant: "destructive",
      });
    }
  };

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysisData(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 500);

      const result = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setAnalysisData(result.data.processedData);
        toast({
          title: "Analysis Complete",
          description: "Website analysis has been completed successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to analyze website",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <Card className="w-full max-w-xl p-6 backdrop-blur-sm bg-white/30 border border-gray-200 rounded-xl shadow-lg">
        <form onSubmit={handleApiKeySubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
              Firecrawl API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
              placeholder="Enter your Firecrawl API key"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Save API Key
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-xl p-6 backdrop-blur-sm bg-white/30 border border-gray-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <form onSubmit={handleAnalysis} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-gray-700">
              Website URL
            </label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="example.com"
              required
            />
          </div>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">
                Analyzing website... {progress}%
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isAnalyzing}
            className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200"
          >
            {isAnalyzing ? "Analyzing..." : "Start Analysis"}
          </Button>
        </form>
      </Card>

      {analysisData && (
        <ResultsDisplay isVisible={true} analysisData={analysisData} />
      )}
    </div>
  );
};

export default UrlAnalyzer;
