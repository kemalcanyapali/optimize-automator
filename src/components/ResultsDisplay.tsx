
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AnalysisData {
  title?: string;
  content?: string;
  links?: string[];
}

interface ResultsDisplayProps {
  isVisible: boolean;
  analysisData?: AnalysisData;
}

const ResultsDisplay = ({ isVisible, analysisData }: ResultsDisplayProps) => {
  if (!isVisible || !analysisData) return null;

  return (
    <Card className="w-full max-w-4xl p-6 mt-8 backdrop-blur-sm bg-white/30 border border-gray-200 rounded-xl shadow-lg animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          <p className="text-sm text-gray-500">
            Website crawl results
          </p>
        </div>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-8">
            {/* Title Section */}
            {analysisData.title && (
              <section className="space-y-3">
                <h4 className="text-md font-medium text-gray-800">Page Title</h4>
                <div className="text-sm text-gray-600">
                  {analysisData.title}
                </div>
              </section>
            )}

            {/* Content Section */}
            {analysisData.content && (
              <section className="space-y-3">
                <h4 className="text-md font-medium text-gray-800">Page Content</h4>
                <div className="text-sm text-gray-600">
                  {analysisData.content}
                </div>
              </section>
            )}

            {/* Links Section */}
            {analysisData.links && analysisData.links.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-md font-medium text-gray-800">Found Links</h4>
                <div className="space-y-2">
                  {analysisData.links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {index + 1}
                      </Badge>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
