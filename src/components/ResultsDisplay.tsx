
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ResultsDisplayProps {
  isVisible: boolean;
  analysisData?: {
    seoScore: number;
    keywords: string[];
    recommendations: string[];
    contentGaps: string[];
    audienceInsights: string[];
  };
}

const ResultsDisplay = ({ isVisible, analysisData }: ResultsDisplayProps) => {
  if (!isVisible) return null;

  // Default data for demonstration
  const defaultData = {
    seoScore: 85,
    keywords: ["seo", "optimization", "content", "marketing"],
    recommendations: [
      "Optimize meta descriptions",
      "Improve mobile responsiveness",
      "Add more internal links",
      "Optimize image alt tags"
    ],
    contentGaps: [
      "Missing blog section",
      "No product comparison pages",
      "Limited case studies"
    ],
    audienceInsights: [
      "Primary audience: Marketing professionals",
      "Secondary audience: Small business owners",
      "High interest in ROI metrics"
    ]
  };

  const data = analysisData || defaultData;

  return (
    <Card className="w-full max-w-4xl p-6 mt-8 backdrop-blur-sm bg-white/30 border border-gray-200 rounded-xl shadow-lg animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
          <p className="text-sm text-gray-500">
            Comprehensive SEO analysis of your website
          </p>
        </div>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <div className="space-y-8">
            {/* SEO Score Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">SEO Score</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {data.seoScore}/100
                </Badge>
                <span className="text-sm text-gray-600">
                  {data.seoScore >= 80 ? "Good" : data.seoScore >= 60 ? "Fair" : "Needs Improvement"}
                </span>
              </div>
            </section>

            {/* Keywords Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Top Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {data.keywords.map((keyword) => (
                  <Badge key={keyword} variant="outline" className="bg-white/50">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Content Gaps Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Content Gaps</h4>
              <ul className="space-y-2">
                {data.contentGaps.map((gap, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-sm text-gray-600">{gap}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Audience Insights Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Audience Insights</h4>
              <ul className="space-y-2">
                {data.audienceInsights.map((insight, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-sm text-gray-600">{insight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Recommendations Section */}
            <section className="space-y-3">
              <h4 className="text-md font-medium text-gray-800">Quick Recommendations</h4>
              <ul className="space-y-2">
                {data.recommendations.map((rec, index) => (
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
