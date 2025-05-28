
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
      const topic = customTopic || `${formatInfo?.title.toLowerCase()} content`;

      const prompt = `You are a viral TikTok content creator expert. Based on this business: ${systemPrompt}

Create a VIRAL TikTok slideshow in the "${formatInfo?.title}" format${customTopic ? ` about: ${topic}` : ''}.

REQUIREMENTS:
- Title must be EXTREMELY clickbait and viral (use power words, numbers, emojis)
- Each slide must be SHORT, punchy, and hook-worthy 
- Use emojis, bold text (**text**), and attention-grabbing language
- Make people want to STOP scrolling and engage
- Think "this will get millions of views"
- Search terms should be relevant to finding images for YOUR specific business/niche

Return ONLY valid JSON in this exact format:
{
  "title": "🤯 VIRAL clickbait title with emojis and power words!",
  "slides": [
    "🔥 Slide 1: Short punchy hook with **bold text** #hashtag",
    "💡 Slide 2: Mind-blowing fact that stops scrolling",
    "⚡ Slide 3: Controversial or surprising statement",
    "🚨 Slide 4: Problem that makes people relate",
    "✨ Slide 5: Solution that creates urgency"
  ],
  "searchTerms": ["relevant visual 1", "relevant visual 2", "relevant visual 3", "relevant visual 4", "relevant visual 5"]
}

Make it SO viral that people can't scroll past it!`;

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
          temperature: 0.9,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean up the response to extract JSON
      content = content.replace(/```json\s*|\s*```/g, '').trim();
      
      try {
        const parsedContent = JSON.parse(content);
        setGeneratedContent({
          ...parsedContent,
          format: formatInfo?.title || selectedFormat
        });

        toast({
          title: "Viral content generated! 🔥",
          description: "Your slideshow is ready to go viral!",
        });
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        toast({
          title: "Generation failed",
          description: "Failed to parse the generated content. Please try again.",
          variant: "destructive",
        });
      }
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
            Generate Viral Content
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
                  Choose Format
                </CardTitle>
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
                <CardTitle className="text-white">Custom Topic</CardTitle>
                <CardDescription className="text-gray-300">
                  Optional: Specify a particular angle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., morning routines, productivity..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                />
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
                  Creating Viral Content...
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
                <CardContent className="text-center py-16">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-300 text-lg">
                    Select a format and generate viral content
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
