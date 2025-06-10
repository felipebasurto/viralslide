import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Globe, Info, Clock, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ContentResult } from "@/components/ContentResult";

interface GeneratedContent {
  /** The clickbait-style title / hook for the slideshow */
  title: string;
  /** Array of 3 different hook variations - user can pick the best */
  hookVariations: string[];
  /** The selected hook index (default: 0) */
  selectedHookIndex: number;
  /** Array of 5 content slide strings with markdown for styling and emojis */
  slides: string[];
  /** Call-to-action slide - last slide */
  cta: string;
  /** Recommended search terms for sourcing visuals */
  searchTerms: string[];
  /** The human-readable format name (e.g. "Top 5 Tips") */
  format: string;
}

const viralFormats = [{
  id: "top5tips",
  title: "Top 5 Tips",
  description: "Share your best tips about something you know well",
  emoji: "🔥",
  example: "morning habits that changed my life"
}, {
  id: "commonerrors",
  title: "Common Errors",
  description: "Call out mistakes people make in your field",
  emoji: "⚠️",
  example: "mistakes killing your productivity"
}, {
  id: "recommendations",
  title: "Recommendations",
  description: "Recommend tools, products, or strategies that work",
  emoji: "⭐",
  example: "tools every entrepreneur actually needs"
}, {
  id: "beforeafter",
  title: "Before vs After",
  description: "Show a transformation or improvement story",
  emoji: "✨",
  example: "how I transformed my morning routine"
}, {
  id: "myths",
  title: "Myths vs Facts",
  description: "Debunk common misconceptions in your niche",
  emoji: "💡",
  example: "productivity myths that need to die"
}, {
  id: "beginner",
  title: "Beginner's Guide",
  description: "Essential first steps for newcomers",
  emoji: "🎯",
  example: "meditation for complete beginners"
}, {
  id: "custom",
  title: "Custom Format",
  description: "Create your own unique viral format",
  emoji: "🎨",
  example: "propaganda I'm not falling for"
}];

const languages = [{
  code: "en",
  name: "English"
}, {
  code: "es",
  name: "Español"
}, {
  code: "pt",
  name: "Português"
}, {
  code: "fr",
  name: "Français"
}, {
  code: "de",
  name: "Deutsch"
}, {
  code: "it",
  name: "Italiano"
}];

const topicSuggestions = {
  top5tips: ["productivity hacks", "morning routines", "healthy habits", "time management", "study techniques"],
  commonerrors: ["workout mistakes", "business failures", "coding errors", "diet misconceptions", "social media blunders"],
  recommendations: ["productivity apps", "books to read", "workout equipment", "learning resources", "business tools"],
  beforeafter: ["morning routine", "workspace setup", "fitness journey", "skill development", "mindset shift"],
  myths: ["fitness myths", "productivity myths", "money myths", "health myths", "learning myths"],
  beginner: ["meditation basics", "investing 101", "cooking essentials", "fitness fundamentals", "coding basics"],
  custom: ["viral hooks", "storytelling", "engagement tactics", "trend analysis", "creative formats"]
};

/**
 * Call Deepseek API to generate TikTok slideshow content.
 */
async function fetchGeneratedContent(apiKey: string, systemPrompt: string, formatId: string, customTopic: string, language: string, customFormat: string, contentMode: string, onProgress?: (stage: string) => void): Promise<GeneratedContent> {
  const formatInfo = viralFormats.find(f => f.id === formatId);
  const topic = customTopic || `${formatInfo?.title.toLowerCase()} content`;
  const isOrganic = contentMode === "organic";
  
  onProgress?.(isOrganic ? "Preparing educational content strategy..." : "Preparing viral content strategy...");
  
  const getLanguageInstruction = (lang: string) => {
    switch (lang) {
      case "es": return "Respond in Spanish. All content should be in Spanish.";
      case "pt": return "Respond in Portuguese. All content should be in Portuguese.";
      case "fr": return "Respond in French. All content should be in French.";
      case "de": return "Respond in German. All content should be in German.";
      case "it": return "Respond in Italian. All content should be in Italian.";
      default: return "Respond in English. All content should be in English.";
    }
  };
  const languageInstruction = getLanguageInstruction(language);
  
  // Different hook examples based on content mode
  const getHookExamples = (lang: string, isOrganic: boolean) => {
    if (isOrganic) {
      switch (lang) {
        case "es":
          return `
EXAMPLES OF ORGANIC/EDUCATIONAL HOOKS (for natural learning):
- "hoy quiero compartir contigo [TEMA]"
- "esto es lo que he aprendido sobre [TEMA]"  
- "permíteme explicarte [CONCEPTO]"
- "en mi experiencia con [TEMA]..."
- "una cosa que me ayudó mucho con [PROBLEMA]"
- "te comparto lo que funciona para [OBJETIVO]"
`;
        case "pt":
          return `
EXAMPLES OF ORGANIC/EDUCATIONAL HOOKS (for natural learning):
- "hoje quero compartilhar com você [TÓPICO]"
- "isso é o que aprendi sobre [TÓPICO]"
- "deixe-me explicar [CONCEITO]"
- "na minha experiência com [TÓPICO]..."
- "uma coisa que me ajudou muito com [PROBLEMA]"
- "vou compartilhar o que funciona para [OBJETIVO]"
`;
        default:
          return `
EXAMPLES OF ORGANIC/EDUCATIONAL HOOKS (for natural learning):
- "let me share what I've learned about [TOPIC]"
- "here's what helped me with [PROBLEM]"
- "in my experience with [TOPIC]..."
- "something that really worked for me with [GOAL]"
- "I want to talk about [TOPIC] today"
- "let me explain [CONCEPT] in simple terms"
`;
      }
    } else {
      switch (lang) {
        case "es":
          return `
EXAMPLES OF VIRAL HOOKS (use as inspiration):
- "¿sabías que hay una forma sencilla de conseguir [RESULTADO]?"
- "deja de desplazarte si quieres descubrir [SECRETO]"
- "¿y si te dijera que [RESULTADO] está a un solo paso?"
- "¿por qué nadie habla de [TEMA]?"
- "imagina que pudieras [RESULTADO DESEADO]"
- "esto cambiará tu forma de ver [TEMA]"
- "todo lo que sabías sobre [TEMA] es 100% erróneo"
- "¿te has preguntado alguna vez por qué [PROBLEMA]?"
- "nadie te lo ha dicho todavía pero [VERDAD]"
- "¿estás cansado de [PROBLEMA]? entonces prueba esto"
`;
        case "pt":
          return `
EXAMPLES OF VIRAL HOOKS (use as inspiration):
- "e se eu te dissesse que há uma forma simples de conseguir [RESULTADO]?"
- "pare de rolar se quiser descobrir [SEGREDO]"
- "imagine se você pudesse [RESULTADO DESEJADO]"
- "por que ninguém fala sobre [TÓPICO]?"
- "isso vai mudar como você vê [TÓPICO]"
- "tudo que você sabia sobre [TÓPICO] está 100% errado"
- "você já se perguntou por que [PROBLEMA]?"
- "ninguém te contou isso ainda, mas [VERDADE]"
- "está cansado de [PROBLEMA]? então tente isso"
`;
        default:
          return `
EXAMPLES OF VIRAL HOOKS (use as inspiration):
- "what if I told you there's a simple way to achieve [RESULT]?"
- "stop scrolling if you want to discover [SECRET]"
- "imagine if you could [DESIRED OUTCOME]"
- "why does nobody talk about [TOPIC]?"
- "this will change how you see [TOPIC]"
- "everything you knew about [TOPIC] is 100% wrong"
- "have you ever wondered why [PROBLEM]?"
- "nobody told you this yet but [TRUTH]"
- "are you tired of [PROBLEM]? then try this"
- "here's why 99% of [AUDIENCE] fail at [TOPIC]"
`;
      }
    }
  };
  const hookExamples = getHookExamples(language, isOrganic);

  const formatInstruction = formatId === "custom" && customFormat ? 
    `Create content using this CUSTOM FORMAT: ${customFormat}` : 
    `Create ${isOrganic ? 'educational' : 'viral'} slideshow content in "${formatInfo?.title}" format for social media platforms`;

  const contentRequirements = isOrganic ? `
STRUCTURE REQUIRED:
1. HOOK (slide 1): Natural, conversational opening that introduces the topic genuinely
2. CONTENT SLIDES (slides 2-6): 5 slides of pure educational value with actionable insights
3. CTA (slide 7): Authentic engagement question or community building

CRITICAL REQUIREMENTS FOR ORGANIC CONTENT:
- HOOK should be genuine, conversational, and educational in tone
- NO clickbait, NO "scroll-stopping" language, NO psychological manipulation
- Focus on pure educational VALUE and authentic sharing
- Natural, personal tone - like talking to a friend
- Educational first, authentic engagement last
- Make it helpful and genuine, not attention-grabbing

VOICE AND TONE:
- Write exactly as specified in the custom format/personal voice
- If custom format mentions personality traits, follow them EXACTLY
- Use the person's natural speaking style and perspective
- Be authentic to their voice, not generic viral content` : `
STRUCTURE REQUIRED:
1. HOOK (slide 1): The most viral, attention-grabbing opening possible. This is CRITICAL for success.
2. CONTENT SLIDES (slides 2-6): 5 slides of genuine, actionable value
3. CTA (slide 7): Subtle product mention as helpful tool

CRITICAL REQUIREMENTS FOR VIRAL CONTENT:
- HOOK must be scroll-stopping, use psychological triggers from the examples
- Focus on providing REAL VALUE in content slides
- Organic tone, lowercase text, no emojis or markdown
- Educational first, promotional last
- Make the hook irresistible and curiosity-driven`;

  const prompt = `${formatInstruction} for: ${systemPrompt}

${customTopic ? `Topic: ${topic}` : ''}

${languageInstruction}

${hookExamples}

${contentRequirements}

CRITICAL REQUIREMENT: You MUST generate exactly 3 different hook variations in the hookVariations array. This is essential for the user experience. Each hook should use different psychological triggers or angles.

RESPOND ONLY WITH VALID JSON - NO OTHER TEXT:

{
  "title": "${isOrganic ? 'natural, authentic title about the topic' : 'authentic lowercase title that promises real value'}",
  "hookVariations": [
    "${isOrganic ? 'genuine, conversational opening variation 1' : 'viral hook variation 1 that stops scrolling'}",
    "${isOrganic ? 'genuine, conversational opening variation 2' : 'viral hook variation 2 with different angle'}",
    "${isOrganic ? 'genuine, conversational opening variation 3' : 'viral hook variation 3 with unique trigger'}"
  ],
  "slides": ["${isOrganic ? 'educational point 1' : 'value slide 1'}", "${isOrganic ? 'educational point 2' : 'value slide 2'}", "${isOrganic ? 'educational point 3' : 'value slide 3'}", "${isOrganic ? 'educational point 4' : 'value slide 4'}", "${isOrganic ? 'educational point 5' : 'value slide 5'}"],
  "cta": "${isOrganic ? 'authentic engagement question or community building' : 'subtle product mention as helpful solution'}",
  "searchTerms": ["visual 1", "visual 2", "visual 3", "visual 4", "visual 5", "visual 6", "visual 7"]
}`;

  onProgress?.("Analyzing your voice and topic...");
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.7,
      max_tokens: 1200
    })
  });

  onProgress?.("Crafting 3 hook variations...");
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API request failed:", response.status, errorText);
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  const apiResponse = await response.json();
  onProgress?.("Building your content slides...");
  const content = apiResponse.choices?.[0]?.message?.content || "";
  if (!content) {
    throw new Error("Empty response from API");
  }

  onProgress?.("Optimizing for engagement...");

  // Enhanced JSON extraction
  let jsonString = content;
  jsonString = jsonString.replace(/```json\s*|\s*```/g, "").trim();
  const jsonStart = jsonString.indexOf('{');
  const jsonEnd = jsonString.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    console.error("No JSON object found in response");
    throw new Error("No valid JSON found in response");
  }
  jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
  
  try {
    const parsed = JSON.parse(jsonString);

    // Validate required fields for new structure
    if (!parsed.title || !parsed.hookVariations || !Array.isArray(parsed.hookVariations) || !parsed.slides || !parsed.cta || !Array.isArray(parsed.searchTerms)) {
      console.error("Invalid JSON structure:", parsed);
      throw new Error("Response missing required fields (title, hookVariations, slides, cta, searchTerms)");
    }
    
    // Ensure we always have exactly 3 hook variations
    const hookVariations = [...parsed.hookVariations];
    while (hookVariations.length < 3) {
      const baseHook = hookVariations[0] || "Check this out...";
      const variations = [
        baseHook.replace(/\b(what if|imagine|have you ever)\b/gi, "did you know"),
        baseHook.replace(/\b(secret|hack|trick)\b/gi, "method"),
        baseHook.replace(/\b(stop scrolling|attention)\b/gi, "listen up")
      ];
      hookVariations.push(variations[hookVariations.length - 1] || `${baseHook} (variation ${hookVariations.length + 1})`);
    }
    
    return {
      ...parsed,
      hookVariations: hookVariations.slice(0, 3), // Ensure exactly 3
      selectedHookIndex: 0, // Default to first hook
      format: formatInfo?.title || formatId
    };
  } catch (e) {
    console.error("JSON parsing failed:", e);
    console.error("Attempted to parse:", jsonString);
    throw new Error("Invalid JSON response from API");
  }
}

const Generate = () => {
  const [selectedFormat, setSelectedFormat] = useState<string>("");
  const [customFormat, setCustomFormat] = useState<string>("");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [contentMode, setContentMode] = useState<string>("viral");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [hasApiSetup, setHasApiSetup] = useState<boolean>(false);
  const { toast } = useToast();

  // Check API setup on component mount
  useEffect(() => {
    const apiKey = localStorage.getItem("deepseek_api_key") || "";
    const systemPrompt = localStorage.getItem("system_prompt") || "";
    setHasApiSetup(!!apiKey && !!systemPrompt);
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedFormat = localStorage.getItem("preferred_format");
    const savedLanguage = localStorage.getItem("preferred_language");
    const savedCustomFormat = localStorage.getItem("custom_format");
    const savedContentMode = localStorage.getItem("content_mode");
    
    if (savedFormat && viralFormats.find(f => f.id === savedFormat)) {
      setSelectedFormat(savedFormat);
    }
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
    if (savedCustomFormat) {
      setCustomFormat(savedCustomFormat);
    }
    if (savedContentMode) {
      setContentMode(savedContentMode);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    if (selectedFormat) {
      localStorage.setItem("preferred_format", selectedFormat);
    }
  }, [selectedFormat]);
  
  useEffect(() => {
    localStorage.setItem("preferred_language", selectedLanguage);
  }, [selectedLanguage]);
  
  useEffect(() => {
    localStorage.setItem("custom_format", customFormat);
  }, [customFormat]);

  useEffect(() => {
    localStorage.setItem("content_mode", contentMode);
  }, [contentMode]);

  const handleProgress = (stage: string) => {
    setCurrentStage(stage);
    if (stage.includes("Preparing")) {
      setGenerationProgress(20);
      setEstimatedTime(15);
    } else if (stage.includes("Analyzing")) {
      setGenerationProgress(35);
      setEstimatedTime(12);
    } else if (stage.includes("Crafting")) {
      setGenerationProgress(55);
      setEstimatedTime(8);
    } else if (stage.includes("Building")) {
      setGenerationProgress(75);
      setEstimatedTime(5);
    } else if (stage.includes("Optimizing")) {
      setGenerationProgress(90);
      setEstimatedTime(2);
    } else if (stage.includes("Finalizing")) {
      setGenerationProgress(95);
      setEstimatedTime(1);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFormat) {
      toast({
        title: "Format Required",
        description: "Please select a viral format to generate content.",
        variant: "destructive"
      });
      return;
    }

    if (selectedFormat === "custom" && !customFormat.trim()) {
      toast({
        title: "Custom Format Required",
        description: "Please describe your custom format.",
        variant: "destructive"
      });
      return;
    }

    const apiKey = localStorage.getItem("deepseek_api_key") || "";
    const systemPrompt = localStorage.getItem("system_prompt") || "";
    setIsGenerating(true);
    setGenerationProgress(0);
    setEstimatedTime(20);

    // Require API key and system prompt - no fallbacks
    if (!apiKey || !systemPrompt) {
      toast({
        title: "Setup Required",
        description: "Please add your API key and business information in Settings before generating content.",
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }

    try {
      const content = await fetchGeneratedContent(apiKey, systemPrompt, selectedFormat, customTopic, selectedLanguage, customFormat, contentMode, handleProgress);
      setGeneratedContent(content);
      setGenerationProgress(100);
      toast({
        title: `${contentMode === "organic" ? "Organic" : "Viral"} content generated! ${contentMode === "organic" ? "🌱" : "🔥"}`,
        description: `Your ${contentMode === "organic" ? "educational slideshow" : "slideshow with viral hook"} is ready!`
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setCurrentStage("");
      setEstimatedTime(0);
    }
  };

  const handleTopicSuggestion = (suggestion: string) => {
    setCustomTopic(suggestion);
  };

  const handleHookSelectionChange = (index: number) => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        selectedHookIndex: index
      });
    }
  };

  const selectedFormatInfo = viralFormats.find(f => f.id === selectedFormat);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Glass Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:text-gray-900 transition-all duration-300 bg-white/10 hover:bg-white/90 backdrop-blur-sm font-medium shadow-lg rounded-xl hover:scale-105">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Generate {contentMode === "organic" ? "Organic" : "Viral"} Content
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* API Setup Warning */}
      {!hasApiSetup && (
        <div className="max-w-6xl mx-auto px-6 py-4 relative z-10">
          <div className="backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/40 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">
                  API Setup Required
                </h3>
                <p className="text-white/80 mb-4 font-medium">
                  You need to configure your Deepseek API key and business information before generating content.
                </p>
                <Link to="/settings">
                  <Button className="bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-600/90 hover:to-red-600/90 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <div className="space-y-6">
            {/* Content Settings - Combined Mode & Language */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                  Content Settings
                </h3>
                <p className="text-white/70 text-sm font-medium">
                  Choose your content mode and language
                </p>
              </div>
              
              {/* Content Mode Selection */}
              <div className="mb-6">
                <div className="text-white text-sm mb-3 font-medium">Content Mode</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setContentMode("viral")}
                    className={`p-4 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                      contentMode === "viral"
                        ? "bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-400/40 shadow-lg scale-105"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🔥</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-white">Viral Content</div>
                        <div className="text-xs text-white/70 mt-1">Attention-grabbing hooks</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setContentMode("organic")}
                    className={`p-4 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                      contentMode === "organic"
                        ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400/40 shadow-lg scale-105"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🌱</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-white">Organic Content</div>
                        <div className="text-xs text-white/70 mt-1">Educational & authentic</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <div className="text-white text-sm mb-3 font-medium flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-pink-400" />
                  Language
                </div>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white backdrop-blur-sm rounded-xl h-12 px-3 hover:bg-white/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Format Selection */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                  Choose Format
                  <Info className="w-4 h-4 ml-2 text-white/50" />
                </h3>
                <p className="text-white/70 text-sm font-medium">
                  Pick a format that works for your content
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {viralFormats.map(format => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-xl transition-all duration-300 backdrop-blur-sm border text-left ${
                      selectedFormat === format.id
                        ? "bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-pink-400/40 shadow-lg scale-102"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{format.emoji}</span>
                      <div className="flex-1">
                        <div className="font-medium text-white">{format.title}</div>
                        <div className="text-xs text-white/70 mt-1">{format.description}</div>
                        <div className="text-xs italic text-white/50 mt-1">"{format.example}"</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Format Field */}
            {selectedFormat === "custom" && (
              <div className="backdrop-blur-xl bg-white/5 border border-purple-400/30 rounded-2xl p-6 shadow-2xl">
                <div className="mb-4">
                  <h3 className="text-white font-semibold text-lg mb-2 flex items-center">
                    🎨 Custom Format Description
                  </h3>
                  <p className="text-purple-200/80 text-sm font-medium">
                    Tell us about your custom format idea
                  </p>
                </div>
                <Input
                  placeholder="Start with a shocking statistic, then reveal 3 counterintuitive strategies, end with a personal story"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  className="bg-white/10 border-purple-300/30 text-white placeholder:text-white/50 focus:border-purple-400/60 rounded-xl h-12 backdrop-blur-sm"
                />
              </div>
            )}

            {/* Content Generation - Combined Topic, Templates & Generate */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-2xl p-6 shadow-2xl">
              <div className="mb-6">
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                  Generate Content
                </h3>
                <p className="text-white/70 text-sm font-medium">
                  Add a custom topic or use quick templates to get started
                </p>
              </div>
              
              {/* Custom Topic */}
              <div className="mb-6">
                <div className="text-white text-sm mb-3 font-medium">Custom Topic (Optional)</div>
                <Input
                  placeholder="morning routines, productivity tips, etc."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400/60 rounded-xl h-12 backdrop-blur-sm"
                />
                
                {selectedFormat && topicSuggestions[selectedFormat as keyof typeof topicSuggestions] && (
                  <div className="mt-3">
                    <div className="text-white/70 text-xs mb-2 font-medium">Popular topics:</div>
                    <div className="flex flex-wrap gap-2">
                      {topicSuggestions[selectedFormat as keyof typeof topicSuggestions].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => handleTopicSuggestion(suggestion)}
                          className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 cursor-pointer transition-colors border border-purple-400/30 px-3 py-1 rounded-full text-xs backdrop-blur-sm hover:scale-105 duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Start Templates */}
              {!selectedFormat && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                  <h4 className="text-blue-200 font-medium mb-3 flex items-center">
                    ⚡ Quick Start Templates
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        setSelectedFormat("top5tips");
                        setCustomTopic("productivity hacks");
                      }}
                      className="text-left p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 rounded-lg transition-all duration-200 hover:scale-102"
                    >
                      <div className="text-blue-200 font-medium text-sm">🔥 Productivity Tips</div>
                      <div className="text-blue-300/70 text-xs">Top 5 productivity hacks that changed my life</div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFormat("commonerrors");
                        setCustomTopic("social media mistakes");
                      }}
                      className="text-left p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 rounded-lg transition-all duration-200 hover:scale-102"
                    >
                      <div className="text-blue-200 font-medium text-sm">⚠️ Common Mistakes</div>
                      <div className="text-blue-300/70 text-xs">Social media mistakes killing your growth</div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFormat("beforeafter");
                        setCustomTopic("morning routine transformation");
                      }}
                      className="text-left p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 rounded-lg transition-all duration-200 hover:scale-102"
                    >
                      <div className="text-blue-200 font-medium text-sm">✨ Transformation</div>
                      <div className="text-blue-300/70 text-xs">My morning routine before vs after</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!selectedFormat || (selectedFormat === "custom" && !customFormat.trim()) || isGenerating}
                className="w-full bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-600/90 hover:to-purple-600/90 disabled:from-gray-500/50 disabled:to-gray-600/50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl border-0 backdrop-blur-sm text-lg"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{currentStage || "Generating..."}</span>
                    <span className="text-sm opacity-75">({estimatedTime}s)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate {contentMode === "organic" ? "Organic" : "Viral"} Content</span>
                  </div>
                )}
              </Button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-4">
                  <Progress value={generationProgress} className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 rounded-full" style={{width: `${generationProgress}%`}}></div>
                  </Progress>
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>{currentStage}</span>
                    <span>{generationProgress}% complete</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {/* Content Preview/Examples */}
            {!generatedContent && (
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                  👁️ Content Preview
                </h3>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl p-4 border border-pink-400/30">
                    <div className="text-pink-200 font-medium text-sm mb-2">🔥 Hook Example (Viral Mode)</div>
                    <div className="text-white/80 text-sm italic">"what if I told you there's a simple way to double your productivity in just 5 minutes?"</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-400/30">
                    <div className="text-green-200 font-medium text-sm mb-2">🌱 Hook Example (Organic Mode)</div>
                    <div className="text-white/80 text-sm italic">"today I want to share 5 productivity techniques that genuinely changed how I work"</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-400/30">
                    <div className="text-blue-200 font-medium text-sm mb-2">📱 Multi-Platform Ready</div>
                    <div className="text-white/80 text-sm">Your content will be optimized for Instagram, TikTok, Twitter, YouTube Shorts, and more!</div>
                  </div>
                </div>
              </div>
            )}

            {generatedContent && (
              <ContentResult 
                content={generatedContent} 
                onHookSelectionChange={handleHookSelectionChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generate;
