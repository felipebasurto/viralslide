import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ContentResult } from "@/components/ContentResult";

interface GeneratedContent {
  /** The clickbait-style title / hook for the slideshow */
  title: string;
  /** Array of slide strings with markdown for styling and emojis */
  slides: string[];
  /** Recommended search terms for sourcing visuals */
  searchTerms: string[];
  /** The human-readable format name (e.g. "Top 5 Tips") */
  format: string;
}

const viralFormats = [
  { id: "top5tips", title: "Top 5 Tips", description: "Share your best 5 tips about your niche", emoji: "🔥" },
  { id: "commonerrors", title: "Common Errors", description: "Highlight mistakes people make in your field", emoji: "⚠️" },
  { id: "recommendations", title: "Recommendations", description: "Recommend tools, products, or strategies", emoji: "⭐" },
  { id: "beforeafter", title: "Before vs After", description: "Show transformation or improvement", emoji: "✨" },
  { id: "myths", title: "Myths vs Facts", description: "Debunk common misconceptions", emoji: "💡" },
  { id: "beginner", title: "Beginner's Guide", description: "Essential steps for newcomers", emoji: "🎯" },
];

/**
 * Call Deepseek API to generate viral TikTok slideshow content.
 * @param apiKey - Bearer token for authentication
 * @param systemPrompt - Business context prompt from settings
 * @param formatId - One of the `viralFormats` IDs
 * @param customTopic - Optional custom topic string
 * @returns Parsed `GeneratedContent`
 * @throws When fetch fails or response isn't valid JSON
 */
async function fetchGeneratedContent(
  apiKey: string,
  systemPrompt: string,
  formatId: string,
  customTopic: string
): Promise<GeneratedContent> {
  const formatInfo = viralFormats.find((f) => f.id === formatId);
  const topic = customTopic || `${formatInfo?.title.toLowerCase()} content`;
  const prompt = `You are a viral TikTok content creator and marketing expert. Based on this business: ${systemPrompt}

Create a VIRAL TikTok slideshow in the "${formatInfo?.title}" format${customTopic ? ` specifically about: ${topic}` : ''}.

CRITICAL REQUIREMENTS:

1. **HOOK (Title)**: Create an IRRESISTIBLE clickbait title that makes people STOP scrolling
   - Use power words: "SECRET", "SHOCKING", "MISTAKE", "GENIUS", "INSTANT"
   - Include numbers and emojis strategically
   - Create curiosity gap: "You won't believe what happens next"
   - Make it controversial but truthful

2. **ACTUAL USEFUL CONTENT**: Each slide must provide REAL, actionable value
   - Give specific, practical tips that work
   - Include insider knowledge from your business expertise
   - Make each tip immediately implementable
   - Use concrete examples, not vague advice

3. **VIRAL PSYCHOLOGY**: 
   - Start with a pattern interrupt (shocking fact/statistic)
   - Create "aha moments" that make people screenshot
   - Build anticipation for each next slide
   - Use FOMO and urgency throughout

4. **CALL TO ACTION (Last Slide)**: 
   - Create urgency with limited-time offers
   - Give a clear next step related to your business
   - Use action words: "Download NOW", "Get instant access", "Claim your spot"
   - Include benefit-driven language

5. **Search Terms**: Must be HIGHLY specific to your niche and audience for finding relevant visuals

Return ONLY valid JSON in this exact format:
{
  "title": "🚨 [NUMBER] [POWER WORD] [SPECIFIC TOPIC] SECRETS [AUTHORITY FIGURE] DON'T WANT YOU TO KNOW! 🤯",
  "slides": [
    "🔥 **STOP!** [Shocking statistic or fact] that will blow your mind! #viral",
    "💡 **TIP 1:** [Specific actionable advice with exact steps] - this changed EVERYTHING!",
    "⚡ **TIP 2:** [Another concrete tip with real benefit] - most people do this WRONG!",
    "🚨 **TIP 3:** [Insider secret with specific example] - industry professionals hate this trick!",
    "✨ **TAKE ACTION NOW!** [Clear call to action with urgency] - Link in bio for [specific benefit]! ⏰"
  ],
  "searchTerms": ["[niche-specific visual 1]", "[exact audience scenario 2]", "[product/service in action 3]", "[problem being solved 4]", "[success result 5]"]
}`;

  const response = await fetch("/api/deepseek/chat/v1", {
    method: "POST",
    mode: "cors", // Ensure CORS mode is enabled
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  const raw = await response.text();
  // Strip triple-backticks if present
  const cleaned = raw.replace(/```json\s*|\s*```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return {
    ...parsed,
    format: formatInfo?.title || formatId,
  };
}

const Generate = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedFormat) {
      toast({
        title: "Format Required",
        description: "Please select a viral format to generate content.",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem("deepseek_api_key") || "";
    const systemPrompt = localStorage.getItem("system_prompt") || "";

    if (!apiKey || !systemPrompt) {
      toast({
        title: "Missing Configuration",
        description: "Please set your API key and system prompt in settings.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const content = await fetchGeneratedContent(apiKey, systemPrompt, selectedFormat, customTopic);
      setGeneratedContent(content);
      toast({
        title: "Viral content generated! 🔥",
        description: "Your slideshow is ready to go viral!",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Error Generating Content",
        description: error.message,
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
            <Button
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300"
            >
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
                      className={`p-4 h-auto flex flex-col items-center space-y-2 transition-all duration-300 ${
                        selectedFormat === format.id
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-lg hover:from-pink-600 hover:to-purple-600"
                          : "border-purple-300 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white bg-transparent"
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
                  className="bg-white/10 border-purple-300 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedFormat}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 border-0 shadow-lg"
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
