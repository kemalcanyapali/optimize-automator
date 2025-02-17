import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import ResultsDisplay from '@/components/ResultsDisplay';

interface CrawlResult {
  url: string;
  crawled_data?: string[]; // array of crawled link strings
}

const CrawledLinkItem = ({ link }: { link: CrawlResult }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded p-3 my-2">
      <div className="flex justify-between items-center">
        <div className="text-primary font-medium">{link.url}</div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide Links" : "Show Links"}
        </Button>
      </div>
      {isOpen && link.crawled_data && (
        <ul className="mt-2 space-y-1 pl-4">
          {link.crawled_data.map((l, idx) => (
            <li key={idx} className="text-sm text-gray-700">
              <a
                href={l}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UrlAnalyzer = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [crawledLinks, setCrawledLinks] = useState<CrawlResult[]>([]);

  useEffect(() => {
    loadCrawlResults();
  }, []);

  const loadCrawlResults = async () => {
    try {
      const { data, error } = await supabase
        .from('crawl_results')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        // Assuming each row has 'url' and 'crawled_data' as a JSON array.
        setCrawledLinks(data as CrawlResult[]);
      }
    } catch (error) {
      console.error('Error loading crawl results:', error);
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

      // Call your backend crawl API endpoint
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        const result = await response.json();
        setAnalysisData(result);

        // Store crawl results in Supabase
        const { error: dbError } = await supabase
          .from('crawl_results')
          .insert({
            url,
            crawled_data: result.links, // assuming your API returns { url, links }
          });

        if (dbError) throw dbError;

        await loadCrawlResults();

        toast({
          title: "Analysis Complete",
          description: "Website analysis has been completed successfully!",
        });
      } else {
        const errorResult = await response.json();
        toast({
          title: "Error",
          description: errorResult.error || "Failed to analyze website",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Error",
        description: "An error occurred during analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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

      {/* Display crawled links for each crawled URL */}
      {crawledLinks.length > 0 && (
        <Card className="w-full max-w-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Crawled Links</h3>
          <div className="space-y-4">
            {crawledLinks.map((link, index) => (
              <CrawledLinkItem key={index} link={link} />
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
