
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
 * Demo content generator for when the API is unavailable.
 * @param formatId - ID of the viral format
 * @param customTopic - Optional custom topic string
 * @returns A GeneratedContent object with placeholder data
 */
const getDemoContent = (formatId: string, customTopic: string): GeneratedContent => {
  const formatInfo = viralFormats.find(f => f.id === formatId);
  const baseContent = {
    format: formatInfo?.title || formatId,
    searchTerms: [
      "parent reading bedtime story to child",
      "children's book with personalized character",
      "AI story generation app interface",
      "happy child listening to custom story",
      "family bonding with storytelling"
    ]
  };

  switch (formatId) {
    case "top5tips":
      return {
        ...baseContent,
        title: "5 bedtime story secrets that actually work",
        slides: [
          "most parents make the same bedtime mistake and wonder why kids won't sleep",
          "tip 1: make your child the main character in every story - they listen 3x longer when they're the hero",
          "tip 2: use the same opening phrase every night to signal sleep time - consistency trains their brain",
          "tip 3: let them choose one story element - the setting, the sidekick, or the challenge",
          "tip 4: end every story with a calm resolution where the hero goes to sleep peacefully",
          "try our free ai story generator - creates personalized bedtime stories in seconds"
        ]
      };
    case "commonerrors":
      return {
        ...baseContent,
        title: "bedtime mistakes keeping your kids awake",
        slides: [
          "if your child fights bedtime every night, you might be making these common mistakes",
          "mistake 1: reading the same 3 books over and over - kids get bored and resist",
          "mistake 2: stories that are too exciting - action and adventure wake them up instead of calming down",
          "mistake 3: no consistent routine - their brain doesn't know it's time to wind down",
          "mistake 4: generic characters they can't connect with - personalization makes all the difference",
          "get personalized bedtime stories that avoid all these mistakes - link in bio"
        ]
      };
    case "beforeafter":
      return {
        ...baseContent,
        title: "how we went from 2 hour bedtime battles to 15 minutes",
        slides: [
          "before: screaming, 'just one more story', getting out of bed 10 times, exhausted parents",
          "we tried everything - weighted blankets, melatonin, earlier bedtimes, nothing worked",
          "then we discovered the power of personalized stories where she was the main character",
          "now: she asks to go to bed, falls asleep during the story, sleeps through the night",
          "the difference: stories about her own adventures instead of random characters she doesn't care about",
          "try our ai story generator free - creates stories starring your child in under 30 seconds"
        ]
      };
    case "beginner":
      return {
        ...baseContent,
        title: "complete beginners guide to stress free bedtime",
        slides: [
          "if bedtime is a daily battle, here's exactly what sleep experts recommend",
          "step 1: start the routine 30 minutes before sleep time - bath, pajamas, dim lights",
          "step 2: choose stories with calm themes - avoid monsters, scary parts, or high energy plots",
          "step 3: make it personal - kids connect better when they see themselves in the story",
          "step 4: keep the same routine every single night - consistency is everything for sleep",
          "get unlimited personalized bedtime stories - free trial in our bio"
        ]
      };
    default:
      return {
        ...baseContent,
        title: "the bedtime routine that changed everything",
        slides: [
          "this simple change transformed our chaotic bedtime into peaceful family time",
          "instead of fighting over which book to read, we create new stories together",
          "kids love being the hero of their own adventure every single night",
          "parents love teaching values through personalized stories with specific morals",
          "no more 'read it again' tantrums because every story is unique and special",
          "try our ai story generator free - creates custom bedtime stories in seconds"
        ]
      };
  }
};

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
  
  // Simplified prompt to avoid token limit issues
  const prompt = `Create viral TikTok slideshow content in "${formatInfo?.title}" format for: ${systemPrompt}

${customTopic ? `Topic: ${topic}` : ''}

Requirements:
- Organic tone, lowercase text, no emojis
- 5 slides with real parenting value
- Last slide: subtle call to action
- Return only valid JSON

JSON format:
{
  "title": "authentic lowercase title",
  "slides": ["hook slide", "tip 1", "tip 2", "insight", "call to action"],
  "searchTerms": ["visual 1", "visual 2", "visual 3", "visual 4", "visual 5"]
}`;

  console.log("Sending request to Deepseek API...");

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-chat", // Using regular chat model instead of reasoner
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000, // Reduced token limit for more focused response
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API request failed:", response.status, errorText);
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  const apiResponse = await response.json();
  console.log("API Response:", apiResponse);
  
  const content = apiResponse.choices?.[0]?.message?.content || "";
  console.log("Raw content:", content);
  
  if (!content) {
    throw new Error("Empty response from API");
  }

  // Enhanced JSON extraction
  let jsonString = content;
  
  // Remove markdown code blocks
  jsonString = jsonString.replace(/```json\s*|\s*```/g, "").trim();
  
  // Find JSON object boundaries
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}');
  
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("No JSON object found in response");
    throw new Error("No valid JSON found in response");
  }
  
  jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
  console.log("Extracted JSON:", jsonString);

  try {
    const parsed = JSON.parse(jsonString);
    
    // Validate required fields
    if (!parsed.title || !Array.isArray(parsed.slides) || !Array.isArray(parsed.searchTerms)) {
      console.error("Invalid JSON structure:", parsed);
      throw new Error("Response missing required fields");
    }
    
    return {
      ...parsed,
      format: formatInfo?.title || formatId,
    };
  } catch (e) {
    console.error("JSON parsing failed:", e);
    console.error("Attempted to parse:", jsonString);
    throw new Error("Invalid JSON response from API");
  }
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

    setIsGenerating(true);

    // Fallback to demo content if no API key or system prompt
    if (!apiKey || !systemPrompt) {
      const demo = getDemoContent(selectedFormat, customTopic);
      setGeneratedContent(demo);
      toast({
        title: "Demo content generated! 🎬",
        description: "Using demo content. Add your API key in settings for personalized results.",
      });
      setIsGenerating(false);
      return;
    }

    try {
      const content = await fetchGeneratedContent(apiKey, systemPrompt, selectedFormat, customTopic);
      setGeneratedContent(content);
      toast({
        title: "Viral content generated! 🔥",
        description: "Your slideshow is ready to go viral!",
      });
    } catch (error) {
      console.error("Generation error:", error);
      // Fallback to demo if API call or parsing fails
      const demo = getDemoContent(selectedFormat, customTopic);
      setGeneratedContent(demo);
      toast({
        title: "Demo content generated! 🎬",
        description: "API unavailable or returned invalid JSON. Using demo content instead.",
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
