
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UrlAnalyzer from '@/components/UrlAnalyzer';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              SEO Automation Tool
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Welcome, {profile?.full_name || 'User'}
            </p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8 animate-slide-up">
          <UrlAnalyzer />
          <ResultsDisplay isVisible={true} />
        </div>
      </div>
    </div>
  );
};

export default Index;
