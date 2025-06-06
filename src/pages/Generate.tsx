import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Loader2, Globe, Info, Clock, CheckCircle, Leaf } from "lucide-react";
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
import { buildPrompt } from "@/utils/promptUtils";

interface GeneratedContent {
  /** The clickbait-style title / hook for the slideshow */
  title: string;
  /** The main viral hook - first slide */
  hook: string;
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
  description: "Share your best 5 tips about your niche",
  emoji: "🔥",
  example: "5 morning habits that changed my life"
}, {
  id: "commonerrors",
  title: "Common Errors",
  description: "Highlight mistakes people make in your field",
  emoji: "⚠️",
  example: "mistakes killing your productivity"
}, {
  id: "recommendations",
  title: "Recommendations",
  description: "Recommend tools, products, or strategies",
  emoji: "⭐",
  example: "tools every entrepreneur needs"
}, {
  id: "beforeafter",
  title: "Before vs After",
  description: "Show transformation or improvement",
  emoji: "✨",
  example: "my morning routine transformation"
}, {
  id: "myths",
  title: "Myths vs Facts",
  description: "Debunk common misconceptions",
  emoji: "💡",
  example: "productivity myths debunked"
}, {
  id: "beginner",
  title: "Beginner's Guide",
  description: "Essential steps for newcomers",
  emoji: "🎯",
  example: "getting started with meditation"
}, {
  id: "custom",
  title: "Custom Format",
  description: "Create your own unique format",
  emoji: "🎨",
  example: "your custom viral format"
}];

const languages = [{
  code: "en",
  name: "English"
}, {
  code: "es",
  name: "Español"
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
 * Demo content generator for when the API is unavailable.
 */
const getDemoContent = (formatId: string, customTopic: string, language: "en" | "es"): GeneratedContent => {
  const formatInfo = viralFormats.find(f => f.id === formatId);
  if (language === "es") {
    const baseContent = {
      format: formatInfo?.title || formatId,
      searchTerms: ["padre leyendo cuento a niño", "libro infantil personalizado", "niño feliz escuchando cuento", "familia unida contando historias", "niño durmiendo pacíficamente", "padres relajados después del cuento", "biblioteca familiar"]
    };
    switch (formatId) {
      case "top5tips":
        return {
          ...baseContent,
          title: "5 secretos para que tu hijo se duerma en minutos",
          hook: "¿sabías que hay una forma de hacer que tu hijo se duerma en menos de 15 minutos cada noche?",
          slides: ["consejo 1: haz que tu hijo sea el protagonista - los niños escuchan 3 veces más cuando son el héroe", "consejo 2: usa la misma frase de apertura cada noche - la consistencia entrena su cerebro", "consejo 3: déjales elegir un elemento de la historia - el lugar, el compañero o el desafío", "consejo 4: termina siempre con una resolución tranquila donde el héroe se duerme pacíficamente", "consejo 5: mantén la historia entre 5-10 minutos máximo para evitar sobreestimulación"],
          cta: "¿qué técnica vas a probar esta noche? cuéntame en los comentarios cómo te va"
        };
      case "custom":
        return {
          ...baseContent,
          title: "formato personalizado: mi estrategia única",
          hook: "este formato personalizado está diseñado para tu audiencia específica",
          slides: ["elemento 1: adapta tu mensaje a tu nicho", "elemento 2: usa ejemplos específicos de tu experiencia", "elemento 3: incluye datos relevantes para tu audiencia", "elemento 4: añade tu toque personal único", "elemento 5: termina con tu propuesta de valor"],
          cta: "comparte tu experiencia en los comentarios - ¿qué funciona para ti?"
        };
      default:
        return {
          ...baseContent,
          title: "la rutina nocturna que cambió todo para nosotros",
          hook: "deja de desplazarte si quieres descubrir cómo transformamos el caos nocturno en tiempo familiar pacífico",
          slides: ["antes: peleas por qué libro leer, rabietas constantes, dormir tomaba 2 horas", "el cambio: empezamos a crear nuevas historias juntos cada noche", "a los niños les encanta ser el héroe de su propia aventura personalizada", "a los padres les encanta enseñar valores a través de historias únicas", "resultado: no más 'léelo otra vez' porque cada historia es especial y nueva"],
          cta: "¿tu familia también tiene rituales nocturnos especiales? comparte en comentarios"
        };
    }
  }

  // English content
  const baseContent = {
    format: formatInfo?.title || formatId,
    searchTerms: ["parent reading bedtime story to child", "children's book with personalized character", "child psychology research about sleep", "happy child listening to custom story", "family bonding with storytelling", "peaceful child sleeping", "cozy reading nook"]
  };
  switch (formatId) {
    case "top5tips":
      return {
        ...baseContent,
        title: "5 psychology-backed bedtime tips that actually work",
        hook: "what if I told you there's a simple way to get your child to sleep in under 15 minutes every night?",
        slides: ["tip 1: make them the hero - research shows kids focus 3x longer when they're the protagonist", "tip 2: use the same opening phrase every night to trigger their brain's sleep mode", "tip 3: give them control within boundaries - let them choose the setting or one character trait", "tip 4: always end with a 'sleepy resolution' where the main character winds down peacefully", "tip 5: keep stories 5-10 minutes max to avoid overstimulation before sleep"],
        cta: "which tip are you trying tonight? let me know in the comments how it goes"
      };
    case "custom":
      return {
        ...baseContent,
        title: "custom format: my unique viral strategy",
        hook: "this custom format is designed specifically for your audience and goals",
        slides: ["element 1: tailor your message to your specific niche", "element 2: use examples from your personal experience", "element 3: include data points relevant to your audience", "element 4: add your unique perspective or twist", "element 5: end with your specific value proposition"],
        cta: "share your own experience in the comments - what works for you?"
      };
    case "commonerrors":
      return {
        ...baseContent,
        title: "bedtime mistakes that keep kids awake (backed by sleep research)",
        hook: "stop scrolling - you need to see this if you're struggling with bedtime routines",
        slides: ["mistake 1: exciting plots before bed - action stories increase cortisol and delay sleep by 45 minutes", "mistake 2: inconsistent routine - your child's brain needs the same sequence to release melatonin", "mistake 3: generic characters - kids disconnect when they can't relate to the protagonist", "mistake 4: bright screens during story time - blue light blocks melatonin for 2 hours", "the fix: calming stories where your child is the sleepy hero learning to love bedtime"],
        cta: "what bedtime challenges are you facing? let's solve them together in the comments"
      };
    default:
      return {
        ...baseContent,
        title: "how we cut bedtime from 2 hours to 15 minutes (real parent story)",
        hook: "imagine if you could transform your chaotic bedtime into peaceful family time in just 2 weeks",
        slides: ["before: tantrums, 'just one more story', getting out of bed 10 times every night", "the breakthrough: child experts say kids need to see themselves succeeding at sleep", "we started telling stories where she was the hero learning to love bedtime", "after 2 weeks: she asks to go to bed and falls asleep during the story", "the science: when kids are the protagonist, they internalize positive sleep behaviors"],
        cta: "have you tried making your child the hero? share your results below"
      };
  }
};

/**
 * Call Deepseek API to generate viral TikTok slideshow content.
 */
async function fetchGeneratedContent(apiKey: string, systemPrompt: string, formatId: string, customTopic: string, language: "en" | "es", customFormat: string, organicMode: boolean, onProgress?: (stage: string) => void): Promise<GeneratedContent> {
  const formatInfo = viralFormats.find(f => f.id === formatId);
  onProgress?.("Preparing viral content strategy...");
  
  const prompt = buildPrompt(formatId, systemPrompt, customTopic, language, customFormat, organicMode, formatInfo);

  onProgress?.("Generating viral hook...");
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

  onProgress?.("Processing content slides...");
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API request failed:", response.status, errorText);
    throw new Error(`API request failed (${response.status}): ${errorText}`);
  }

  const apiResponse = await response.json();
  onProgress?.("Finalizing viral content...");
  const content = apiResponse.choices?.[0]?.message?.content || "";
  if (!content) {
    throw new Error("Empty response from API");
  }

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
    if (!parsed.title || !parsed.hook || !Array.isArray(parsed.slides) || !parsed.cta || !Array.isArray(parsed.searchTerms)) {
      console.error("Invalid JSON structure:", parsed);
      throw new Error("Response missing required fields (title, hook, slides, cta, searchTerms)");
    }
    return {
      ...parsed,
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
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">("en");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [organicMode, setOrganicMode] = useState<boolean>(false);
  const { toast } = useToast();

  // Load saved preferences
  useEffect(() => {
    const savedFormat = localStorage.getItem("preferred_format");
    const savedLanguage = localStorage.getItem("preferred_language") as "en" | "es";
    const savedCustomFormat = localStorage.getItem("custom_format");
    
    if (savedFormat && viralFormats.find(f => f.id === savedFormat)) {
      setSelectedFormat(savedFormat);
    }
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setSelectedLanguage(savedLanguage);
    }
    if (savedCustomFormat) {
      setCustomFormat(savedCustomFormat);
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

  const handleProgress = (stage: string) => {
    setCurrentStage(stage);
    if (stage.includes("Preparing")) {
      setGenerationProgress(25);
      setEstimatedTime(15);
    } else if (stage.includes("Generating")) {
      setGenerationProgress(50);
      setEstimatedTime(10);
    } else if (stage.includes("Processing")) {
      setGenerationProgress(75);
      setEstimatedTime(5);
    } else if (stage.includes("Finalizing")) {
      setGenerationProgress(90);
      setEstimatedTime(2);
    }
  };

  // Debug button state
  const isButtonDisabled = isGenerating || !selectedFormat || (selectedFormat === "custom" && !customFormat.trim());
  
  console.log("Generate button debug:", {
    isGenerating,
    selectedFormat,
    customFormat,
    isButtonDisabled,
    customFormatTrimmed: customFormat.trim(),
    organicMode
  });

  const handleGenerate = async () => {
    console.log("Generate button clicked!");
    
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

    // Fallback to demo content if no API key or system prompt
    if (!apiKey || !systemPrompt) {
      handleProgress("Preparing demo content...");
      setTimeout(() => {
        handleProgress("Generating viral hook...");
        setTimeout(() => {
          handleProgress("Processing content slides...");
          setTimeout(() => {
            handleProgress("Finalizing viral content...");
            setTimeout(() => {
              const demo = getDemoContent(selectedFormat, customTopic, selectedLanguage);
              setGeneratedContent(demo);
              setGenerationProgress(100);
              toast({
                title: organicMode ? "Organic demo content generated! 🌱" : "Demo content generated! 🎬",
                description: "Using demo content. Add your API key in settings for personalized results."
              });
              setIsGenerating(false);
            }, 500);
          }, 1000);
        }, 1000);
      }, 1000);
      return;
    }

    try {
      const content = await fetchGeneratedContent(apiKey, systemPrompt, selectedFormat, customTopic, selectedLanguage, customFormat, organicMode, handleProgress);
      setGeneratedContent(content);
      setGenerationProgress(100);
      toast({
        title: organicMode ? "Organic content generated! 🌱" : "Viral content generated! 🔥",
        description: organicMode ? "Your organic, educational content is ready!" : "Your slideshow with viral hook is ready to go viral!"
      });
    } catch (error) {
      console.error("Generation error:", error);
      // Fallback to demo if API call or parsing fails
      const demo = getDemoContent(selectedFormat, customTopic, selectedLanguage);
      setGeneratedContent(demo);
      setGenerationProgress(100);
      toast({
        title: organicMode ? "Organic demo content generated! 🌱" : "Demo content generated! 🎬",
        description: "API unavailable or returned invalid JSON. Using demo content instead."
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

  const selectedFormatInfo = viralFormats.find(f => f.id === selectedFormat);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="border-white text-white hover:text-gray-900 transition-all duration-300 bg-white/20 hover:bg-white backdrop-blur-sm font-medium shadow-md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Generate {organicMode ? "Organic" : "Viral"} Content
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Generation Panel */}
          <div className="space-y-6">
            {/* Content Mode Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center font-semibold">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                  Content Mode
                </CardTitle>
                <CardDescription className="text-gray-200 font-medium">
                  Choose between viral engagement or organic education
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant={!organicMode ? "default" : "outline"}
                    className={`p-4 h-auto flex items-start space-x-3 transition-all duration-300 ${
                      !organicMode
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-lg hover:from-pink-600 hover:to-purple-600 font-medium"
                        : "border-white/40 text-white hover:bg-white/15 hover:border-white/60 hover:text-white bg-white/10 backdrop-blur-sm font-medium"
                    }`}
                    onClick={() => setOrganicMode(false)}
                  >
                    <span className="text-2xl">🔥</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Viral Content</div>
                      <div className="text-xs opacity-80 mt-1">Engaging hooks and viral formats</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={organicMode ? "default" : "outline"}
                    className={`p-4 h-auto flex items-start space-x-3 transition-all duration-300 ${
                      organicMode
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg hover:from-green-600 hover:to-emerald-600 font-medium"
                        : "border-white/40 text-white hover:bg-white/15 hover:border-white/60 hover:text-white bg-white/10 backdrop-blur-sm font-medium"
                    }`}
                    onClick={() => setOrganicMode(true)}
                  >
                    <span className="text-2xl">🌱</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">Organic Content</div>
                      <div className="text-xs opacity-80 mt-1">Pure educational value, no promotion</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center font-semibold">
                  <Globe className="w-5 h-5 mr-2 text-pink-400" />
                  Language
                </CardTitle>
                <CardDescription className="text-gray-200 font-medium">
                  Choose your content language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as "en" | "es")}>
                  <SelectTrigger className="bg-white/10 border-purple-300 text-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900/95 backdrop-blur-lg border-purple-300">
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Format Selection */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center font-semibold">
                  <Sparkles className="w-5 h-5 mr-2 text-pink-400" />
                  Choose Format
                  <Info className="w-4 h-4 ml-2 text-gray-300" />
                </CardTitle>
                <CardDescription className="text-gray-200 font-medium">
                  Select a proven viral format for your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {viralFormats.map(format => (
                    <Button
                      key={format.id}
                      variant={selectedFormat === format.id ? "default" : "outline"}
                      className={`p-4 h-auto flex items-start space-x-3 transition-all duration-300 ${
                        selectedFormat === format.id
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-lg hover:from-pink-600 hover:to-purple-600 font-medium"
                          : "border-white/40 text-white hover:bg-white/15 hover:border-white/60 hover:text-white bg-white/10 backdrop-blur-sm font-medium"
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <span className="text-2xl">{format.emoji}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{format.title}</div>
                        <div className="text-xs opacity-80 mt-1">{format.description}</div>
                        <div className="text-xs italic opacity-60 mt-1">e.g. "{format.example}"</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Custom Format Field */}
            {selectedFormat === "custom" && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 border-purple-400/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    🎨 Custom Format Description
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Describe your unique viral format in detail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g., 'Start with a shocking statistic, then reveal 3 counterintuitive strategies, end with a personal story'"
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    className="bg-white/10 border-purple-300 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                  />
                </CardContent>
              </Card>
            )}

            {/* Custom Topic with Suggestions */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Custom Topic</CardTitle>
                <CardDescription className="text-gray-300">
                  Optional: Specify a particular angle or topic
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="e.g., morning routines, productivity..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-white/10 border-purple-300 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                />
                
                {selectedFormat && topicSuggestions[selectedFormat as keyof typeof topicSuggestions] && (
                  <div>
                    <Label className="text-white text-sm mb-2 block">Popular topics for {selectedFormatInfo?.title}:</Label>
                    <div className="flex flex-wrap gap-2">
                      {topicSuggestions[selectedFormat as keyof typeof topicSuggestions].map(suggestion => (
                        <Badge
                          key={suggestion}
                          variant="secondary"
                          className="bg-purple-500/30 text-purple-200 hover:bg-purple-500/40 cursor-pointer transition-colors border border-purple-400/30"
                          onClick={() => handleTopicSuggestion(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate Button with Progress */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="pt-6">
                <Button
                  onClick={handleGenerate}
                  disabled={isButtonDisabled}
                  className={`w-full py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 border-0 shadow-lg ${
                    organicMode 
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600" 
                      : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  } text-white`}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating {organicMode ? "Organic" : "Viral"} Content...
                    </>
                  ) : (
                    <>
                      {organicMode ? <Leaf className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                      Generate {organicMode ? "Organic" : "Viral"} Content
                    </>
                  )}
                </Button>

                {/* Debug info for troubleshooting */}
                <div className="mt-2 text-xs text-gray-400">
                  Debug: Format={selectedFormat}, Custom={customFormat}, Disabled={isButtonDisabled.toString()}, Organic={organicMode.toString()}
                </div>

                {isGenerating && (
                  <div className="mt-4 space-y-3">
                    <Progress value={generationProgress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-200 flex items-center font-medium">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        {currentStage}
                      </span>
                      <span className="text-gray-300 flex items-center font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{estimatedTime}s remaining
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div>
            {generatedContent ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-200 font-semibold">Content generated successfully!</span>
                </div>
                <ContentResult content={generatedContent} />
              </div>
            ) : (
              <Card className="bg-white/15 backdrop-blur-lg border-white/40 h-full flex items-center justify-center shadow-xl">
                <CardContent className="text-center py-16">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-60" />
                  <p className="text-gray-200 text-lg mb-2 font-medium">
                    Select a format and generate viral content
                  </p>
                  <p className="text-gray-300 text-sm font-medium">
                    Choose from proven formats that drive engagement
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
