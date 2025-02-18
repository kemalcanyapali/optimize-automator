
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface CrawlResult {
  id: string;
  url: string;
  crawled_data: {
    title?: string;
    content?: string;
    links?: string[];
  };
  created_at: string;
}

const UrlAnalyzer = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [crawledLinks, setCrawledLinks] = useState<CrawlResult[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadCrawlResults();
  }, [user, navigate]);

  const loadCrawlResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('crawl_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setCrawledLinks(data as CrawlResult[]);
      }
    } catch (error) {
      console.error('Error loading crawl results:', error);
      toast({
        title: "Error",
        description: "Failed to load crawl results",
        variant: "destructive",
      });
    }
  };

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze websites",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

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
      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 500);

      // Call the crawl API
      const response = await axios.post('/api/crawl', { url });
      const crawlData = {
        title: "Crawled Page",
        content: "Crawled content",
        links: response.data.links || []
      };

      // Clear progress animation and set to 100%
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisData(crawlData);

      // Store crawl results in Supabase
      const { error: dbError } = await supabase
        .from('crawl_results')
        .insert({
          url,
          user_id: user.id,
          crawled_data: crawlData
        });

      if (dbError) throw dbError;

      // Reload crawl results
      await loadCrawlResults();

      toast({
        title: "Analysis Complete",
        description: "Website analysis has been completed successfully!",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return null;
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

      {/* Crawled Links Section */}
      {crawledLinks.length > 0 && (
        <Card className="w-full max-w-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Crawled Links</h3>
          <div className="space-y-2">
            {crawledLinks.map((result, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-primary">{result.url}</div>
                {result.crawled_data.links && (
                  <div className="mt-2 text-sm text-gray-600">
                    {result.crawled_data.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="ml-4">
                        <a href={link} target="_blank" rel="noopener noreferrer" 
                           className="hover:underline">
                          {link}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {analysisData && (
        <ResultsDisplay isVisible={true} analysisData={analysisData} />
      )}
    </div>
  );
};

export default UrlAnalyzer;
