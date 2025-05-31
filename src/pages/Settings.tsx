
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Key, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedApiKey = localStorage.getItem("deepseek_api_key") || "";
    const savedSystemPrompt = localStorage.getItem("system_prompt") || "";
    setApiKey(savedApiKey);
    setSystemPrompt(savedSystemPrompt);
  }, []);

  const handleSave = () => {
    localStorage.setItem("deepseek_api_key", apiKey);
    localStorage.setItem("system_prompt", systemPrompt);
    toast({
      title: "Settings saved successfully!",
      description: "Your API key and system prompt have been saved locally.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="border-white/40 text-white hover:bg-white/20 hover:text-white transition-all duration-300 font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Settings
          </h1>
        </div>
      </header>

      {/* Settings Form */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* API Key Section */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center font-semibold">
                <Key className="w-5 h-5 mr-2 text-pink-400" />
                Deepseek API Configuration
              </CardTitle>
              <CardDescription className="text-gray-200 font-medium">
                Enter your Deepseek API key to enable AI content generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key" className="text-white">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Your API key is stored locally and never shared. Get your key from{" "}
                  <a href="https://platform.deepseek.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">
                    platform.deepseek.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt Section */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white flex items-center font-semibold">
                <FileText className="w-5 h-5 mr-2 text-purple-400" />
                System Prompt
              </CardTitle>
              <CardDescription className="text-gray-200 font-medium">
                Describe your business, product, or service. This information will be used to personalize all generated content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="system-prompt" className="text-white">Business Information</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Example: I run a fitness coaching business focused on helping busy professionals lose weight through home workouts. My target audience is 25-45 year olds who struggle with finding time to exercise..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 min-h-[150px]"
                />
                <p className="text-sm text-gray-400 mt-2">
                  Include details about your product/service, target audience, unique selling points, and any specific messaging you want to emphasize.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
