'use client';

import { useState } from 'react';

export default function SentimentAnalysis() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{
    sentiment: string;
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing text:', error);
      setResult({
        sentiment: 'Error analyzing text. Please try again.',
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-memovault-peach/10">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-memovault-salmon to-memovault-salmon/80 bg-clip-text text-transparent">
            AI Sentiment Analysis
          </h1>
          <p className="text-gray-600 mb-8">
            Analyze the emotional tone of your text using advanced AI technology
          </p>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm bg-white/50">
            <div className="mb-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here for sentiment analysis..."
                className="w-full h-48 p-6 border-2 border-memovault-salmon/20 rounded-xl focus:border-memovault-salmon focus:ring-2 focus:ring-memovault-salmon/20 outline-none resize-none text-lg transition-all duration-200 bg-white/50 placeholder-gray-400"
              />
            </div>

            <button
              onClick={analyzeText}
              disabled={!text.trim() || loading}
              className={`w-full py-4 px-8 rounded-xl text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100
                ${!text.trim() || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-memovault-salmon to-memovault-salmon/80 hover:shadow-lg'
                }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </div>
              ) : 'Analyze Sentiment'}
            </button>
          </div>

          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/50 transform transition-all duration-500 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Analysis Result</h2>
              <div className="space-y-6">
                <div>
                  <div className="inline-block bg-memovault-salmon/10 rounded-full px-6 py-2 mb-2">
                    <p className="text-3xl font-bold text-memovault-salmon">
                      {result.sentiment}
                    </p>
                  </div>
                </div>
                {result.confidence > 0 && (
                  <div className="max-w-md mx-auto">
                    <p className="text-lg font-medium text-gray-700 mb-2">Confidence Score</p>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-memovault-salmon bg-memovault-salmon/10">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-memovault-salmon/20">
                        <div
                          style={{ width: `${result.confidence * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-memovault-salmon transition-all duration-500 ease-out"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
