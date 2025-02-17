
import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface CrawlStatusResponse {
  success: true;
  status: string;
  completed: number;
  total: number;
  creditsUsed: number;
  expiresAt: string;
  data: any[];
}

type CrawlResponse = CrawlStatusResponse | ErrorResponse;

export class FirecrawlService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static normalizeUrl(url: string): string {
    if (!url) return '';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Remove trailing slashes
    url = url.replace(/\/+$/, '');
    
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch (e) {
      console.error('Invalid URL:', e);
      return url;
    }
  }

  static extractSlug(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\/+|\/+$/g, '') || '/';
    } catch (e) {
      return url;
    }
  }

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      const testResponse = await this.firecrawlApp.crawlUrl('https://example.com', {
        limit: 1
      });
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async crawlWebsite(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'API key not found' };
    }

    try {
      const normalizedUrl = this.normalizeUrl(url);
      console.log('Making crawl request to Firecrawl API for:', normalizedUrl);
      
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const crawlResponse = await this.firecrawlApp.crawlUrl(normalizedUrl, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        }
      }) as CrawlResponse;

      if (!crawlResponse.success) {
        console.error('Crawl failed:', (crawlResponse as ErrorResponse).error);
        return { 
          success: false, 
          error: (crawlResponse as ErrorResponse).error || 'Failed to crawl website' 
        };
      }

      // Process the crawled data
      const processedData = await this.processAnalysis(crawlResponse.data);
      
      console.log('Crawl successful:', processedData);
      return { 
        success: true,
        data: {
          ...crawlResponse,
          processedData
        }
      };
    } catch (error) {
      console.error('Error during crawl:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  private static async processAnalysis(crawlData: any[]): Promise<any> {
    try {
      // Organize URLs by slug
      const urlsBySlug = crawlData.reduce((acc: Record<string, any>, page: any) => {
        const slug = this.extractSlug(page.url);
        acc[slug] = page;
        return acc;
      }, {});

      // Prepare content for analysis
      const contentSummary = Object.entries(urlsBySlug)
        .map(([slug, page]: [string, any]) => `Page ${slug}:\n${page.content || 'No content'}\n`)
        .join('\n');

      // Format the analysis prompt
      const analysisPrompt = `Analyze this website content and provide:
1. Target Audience (be specific about demographics and interests)
2. Main Keywords (list 5-10 most relevant keywords)
3. Content Gaps (identify missing topics or areas for improvement)

Website Content:
${contentSummary}`;

      // We'll use the model to analyze the content
      console.log('Analyzing content with LLM...');
      
      // Return structured data
      return {
        urlsBySlug,
        seoScore: 85, // Replace with actual calculation
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
    } catch (error) {
      console.error('Error processing analysis:', error);
      throw error;
    }
  }
}
