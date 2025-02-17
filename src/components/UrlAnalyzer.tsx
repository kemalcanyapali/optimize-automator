
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const UrlAnalyzer = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

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

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          toast({
            title: "Analysis Complete",
            description: "Website analysis has been completed successfully!",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card className="w-full max-w-xl p-6 backdrop-blur-sm bg-white/30 border border-gray-200 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <form onSubmit={handleAnalysis} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-gray-700">
            Website URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
            placeholder="https://example.com"
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
  );
};

export default UrlAnalyzer;
