
import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ContentResult } from "@/components/ContentResult";

interface GeneratedContent {
  title: string;
  slides: string[];
  searchTerms: string[];
  format: string;
}

const viralFormats = [
  {
    id: "top5tips",
    title: "Top 5 Tips",
    description: "Share your best 5 tips about your niche",
    emoji: "🔥"
  },
  {
    id: "commonerrors",
    title: "Common Errors",
    description: "Highlight mistakes people make in your field",
    emoji: "⚠️"
  },
  {
    id: "recommendations",
    title: "Recommendations",
    description: "Recommend tools, products, or strategies",
    emoji: "⭐"
  },
  {
    id: "beforeafter",
    title: "Before vs After",
    description: "Show transformation or improvement",
    emoji: "✨"
  },
  {
    id: "myths",
    title: "Myths vs Facts",
    description: "Debunk common misconceptions",
    emoji: "💡"
  },
  {
    id: "beginner",
    title: "Beginner's Guide",
    description: "Essential steps for newcomers",
    emoji: "🎯"
  }
];

const Generate = () => {
  const [selectedFormat, setSelectedFormat] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem("deepseek_api_key");
    const systemPrompt = localStorage.getItem("system_prompt");

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your Deepseek API key in settings first.",
        variant: "destructive",
      });
      return;
    }

    if (!systemPrompt) {
      toast({
        title: "System Prompt Required",
        description: "Please add your business information in settings first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFormat) {
      toast({
        title: "Format Required",
        description: "Please select a viral format to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const formatInfo = viralFormats.find(f => f.id === selectedFormat);
      const topic = customTopic || `general ${formatInfo?.title.toLowerCase()} content`;

      const prompt = `Based on this business information: ${systemPrompt}

Create a viral TikTok slideshow in the "${formatInfo?.title}" format about: ${topic}

Please provide:
1. A catchy title for the slideshow
2. 5-7 slide texts (each slide should be concise, engaging, and easy to read on mobile)
3. 5-7 search terms for finding viral images to accompany each slide

Format your response as JSON with this structure:
{
  "title": "catchy title here",
  "slides": ["slide 1 text", "slide 2 text", ...],
  "searchTerms": ["search term 1", "search term 2", ...]
}

Make sure the content is:
- Engaging and viral-worthy
- Specific to the business/niche
- Easy to read on mobile screens
- Action-oriented and valuable`;

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Try to parse the JSON response
      try {
        const parsedContent = JSON.parse(content);
        setGeneratedContent({
          ...parsedContent,
          format: formatInfo?.title || selectedFormat
        });
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        const lines = content.split('\n').filter(line => line.trim());
        setGeneratedContent({
          title: `${formatInfo?.title} for ${topic}`,
          slides: lines.slice(0, 6), // Take first 6 lines as slides
          searchTerms: [`${topic} tips`, `${topic} advice`, 'viral content', 'social media', 'trending'],
          format: formatInfo?.title || selectedFormat
        });
      }

      toast({
        title: "Content generated successfully!",
        description: "Your viral slideshow content is ready.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation failed",
        description: "Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Generate Content
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <div className="space-y-6">
            {/* Format Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                  Select Viral Format
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Choose the type of content you want to create
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {viralFormats.map((format) => (
                    <Button
                      key={format.id}
                      variant={selectedFormat === format.id ? "default" : "outline"}
                      className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                        selectedFormat === format.id
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "border-white/20 text-white hover:bg-white/10"
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <span className="text-2xl">{format.emoji}</span>
                      <span className="text-sm font-medium text-center">{format.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Topic */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Custom Topic (Optional)</CardTitle>
                <CardDescription className="text-gray-300">
                  Specify a particular topic or angle for your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="topic" className="text-white">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., morning routines, productivity hacks, budgeting..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedFormat}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Viral Content
                </>
              )}
            </Button>
          </div>

          {/* Results Panel */}
          <div>
            {generatedContent ? (
              <ContentResult content={generatedContent} />
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300">
                    Select a format and click generate to create your viral content
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
