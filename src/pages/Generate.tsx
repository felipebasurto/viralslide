
import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, Globe } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

/**
 * Demo content generator for when the API is unavailable.
 * @param formatId - ID of the viral format
 * @param customTopic - Optional custom topic string
 * @param language - Language code (en/es)
 * @returns A GeneratedContent object with placeholder data
 */
const getDemoContent = (formatId: string, customTopic: string, language: string): GeneratedContent => {
  const formatInfo = viralFormats.find(f => f.id === formatId);
  
  if (language === "es") {
    const baseContent = {
      format: formatInfo?.title || formatId,
      searchTerms: [
        "padre leyendo cuento a niño",
        "libro infantil personalizado",
        "app de cuentos con inteligencia artificial",
        "niño feliz escuchando cuento personalizado",
        "familia unida contando historias"
      ]
    };

    switch (formatId) {
      case "top5tips":
        return {
          ...baseContent,
          title: "5 secretos para que tu hijo se duerma en minutos",
          slides: [
            "la mayoría de padres comete este error y después se pregunta por qué sus hijos no duermen",
            "consejo 1: haz que tu hijo sea el protagonista - los niños escuchan 3 veces más cuando son el héroe",
            "consejo 2: usa la misma frase de apertura cada noche - la consistencia entrena su cerebro",
            "consejo 3: déjales elegir un elemento de la historia - el lugar, el compañero o el desafío",
            "consejo 4: termina siempre con una resolución tranquila donde el héroe se duerme pacíficamente",
            "prueba nuestro generador gratuito de cuentos con ia - crea historias personalizadas en segundos"
          ]
        };
      default:
        return {
          ...baseContent,
          title: "la rutina nocturna que cambió todo para nosotros",
          slides: [
            "este simple cambio transformó nuestro caótico momento de dormir en tiempo familiar pacífico",
            "en lugar de pelear por qué libro leer, creamos nuevas historias juntos",
            "a los niños les encanta ser el héroe de su propia aventura cada noche",
            "a los padres les encanta enseñar valores a través de historias personalizadas",
            "no más rabietas de 'léelo otra vez' porque cada historia es única y especial",
            "prueba nuestro generador gratuito - crea cuentos personalizados en segundos"
          ]
        };
    }
  }

  // English content with real value
  const baseContent = {
    format: formatInfo?.title || formatId,
    searchTerms: [
      "parent reading bedtime story to child",
      "children's book with personalized character",
      "child psychology research about sleep",
      "happy child listening to custom story",
      "family bonding with storytelling"
    ]
  };

  switch (formatId) {
    case "top5tips":
      return {
        ...baseContent,
        title: "5 psychology-backed bedtime tips that actually work",
        slides: [
          "child psychologists studied 500 families and found one common mistake that ruins bedtime",
          "tip 1: create a consistent 'sleep signal' - use the same opening phrase every night to trigger calm mode",
          "tip 2: give them control within boundaries - let them choose the setting or one character trait",
          "tip 3: use their name as the hero - research shows kids focus 3x longer when they're the protagonist",
          "tip 4: end with a 'sleepy resolution' - always have the main character wind down and rest peacefully",
          "bonus: try personalized ai-generated stories that incorporate these techniques automatically"
        ]
      };
    case "commonerrors":
      return {
        ...baseContent,
        title: "bedtime mistakes that keep kids awake (backed by sleep research)",
        slides: [
          "sleep researchers identified these 4 mistakes in 80% of struggling families",
          "mistake 1: exciting plots before bed - action stories increase cortisol and delay sleep by 45 minutes",
          "mistake 2: inconsistent routine - your child's brain needs the same sequence to release melatonin",
          "mistake 3: generic characters - kids disconnect when they can't relate to the protagonist",
          "mistake 4: bright screens during story time - blue light blocks melatonin production for 2 hours",
          "solution: try stories with calming themes where your child is the sleepy hero"
        ]
      };
    default:
      return {
        ...baseContent,
        title: "how we cut bedtime from 2 hours to 15 minutes (real parent story)",
        slides: [
          "before: tantrums, 'just one more story', getting out of bed 10 times every night",
          "the breakthrough: child development experts say kids need to see themselves succeeding at sleep",
          "we started telling stories where she was the main character learning to love bedtime",
          "after 2 weeks: she asks to go to bed and falls asleep during the story",
          "the science: when kids are the hero, they internalize the positive sleep behaviors",
          "try creating stories where your child is the protagonist who loves going to sleep"
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
 * @param language - Language code (en/es)
 * @returns Parsed `GeneratedContent`
 * @throws When fetch fails or response isn't valid JSON
 */
async function fetchGeneratedContent(
  apiKey: string,
  systemPrompt: string,
  formatId: string,
  customTopic: string,
  language: string
): Promise<GeneratedContent> {
  const formatInfo = viralFormats.find((f) => f.id === formatId);
  const topic = customTopic || `${formatInfo?.title.toLowerCase()} content`;
  
  const languageInstruction = language === "es" 
    ? "Respond in Spanish. All content should be in Spanish."
    : "Respond in English. All content should be in English.";
  
  // Value-first prompt focused on providing real insights
  const prompt = `Create viral TikTok slideshow content in "${formatInfo?.title}" format for: ${systemPrompt}

${customTopic ? `Topic: ${topic}` : ''}

${languageInstruction}

CRITICAL: Focus on providing REAL VALUE first. This is educational content that happens to mention a product at the end.

Requirements:
- First 4-5 slides: Genuine, actionable advice that parents can use immediately
- Include real insights, research-backed tips, or relatable parent experiences
- Last slide only: Subtle mention of the product as a helpful tool
- Organic tone, lowercase text, no emojis or markdown
- Make it educational and valuable, not promotional

Example value-first approach:
- Share actual parenting psychology
- Give specific, actionable steps
- Include relatable parent struggles
- Provide immediate solutions they can try tonight

JSON format:
{
  "title": "authentic lowercase title that promises real value",
  "slides": ["value slide 1", "value slide 2", "value slide 3", "value slide 4", "subtle product mention"],
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
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
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
      const demo = getDemoContent(selectedFormat, customTopic, selectedLanguage);
      setGeneratedContent(demo);
      toast({
        title: "Demo content generated! 🎬",
        description: "Using demo content. Add your API key in settings for personalized results.",
      });
      setIsGenerating(false);
      return;
    }

    try {
      const content = await fetchGeneratedContent(apiKey, systemPrompt, selectedFormat, customTopic, selectedLanguage);
      setGeneratedContent(content);
      toast({
        title: "Viral content generated! 🔥",
        description: "Your slideshow is ready to go viral!",
      });
    } catch (error) {
      console.error("Generation error:", error);
      // Fallback to demo if API call or parsing fails
      const demo = getDemoContent(selectedFormat, customTopic, selectedLanguage);
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
            {/* Language Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-pink-400" />
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="bg-white/10 border-purple-300 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-lg border-purple-300">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

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
