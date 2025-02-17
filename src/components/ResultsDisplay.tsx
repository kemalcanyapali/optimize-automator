
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ResultsDisplayProps {
  isVisible: boolean;
}

const ResultsDisplay = ({ isVisible }: ResultsDisplayProps) => {
  if (!isVisible) return null;

  return (
    <Card className="w-full max-w-4xl p-6 mt-8 backdrop-blur-sm bg-white/30 border border-gray-200 rounded-xl shadow-lg animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          <p className="text-sm text-gray-500">
            Here's what we found about your website
          </p>
        </div>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-8">
            {/* SEO Score Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">SEO Score</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  85/100
                </Badge>
                <span className="text-sm text-gray-600">Good</span>
              </div>
            </section>

            {/* Keywords Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Top Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {["seo", "optimization", "content", "marketing"].map((keyword) => (
                  <Badge key={keyword} variant="outline" className="bg-white/50">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Recommendations Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Quick Recommendations</h4>
              <ul className="space-y-2">
                {[
                  "Optimize meta descriptions",
                  "Improve mobile responsiveness",
                  "Add more internal links",
                  "Optimize image alt tags",
                ].map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm text-gray-600">{rec}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
