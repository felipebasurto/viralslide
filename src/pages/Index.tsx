
import { useState } from "react";
import { Settings, Sparkles, TrendingUp, Zap, ArrowRight, Clock, Target, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              ViralSlide
            </h1>
          </div>
          <Link to="/settings">
            <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-400/30">
              ✨ AI-Powered Content Creation
            </Badge>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Create Viral TikTok
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Slideshows
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in">
            Generate engaging slideshow content with AI-powered viral formats. From top tips to common errors, 
            create content that gets views and drives engagement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button size="lg" variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                Configure Settings
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-1">6</div>
              <div className="text-sm text-gray-400">Viral Formats</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">7</div>
              <div className="text-sm text-gray-400">Slides Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-1">2</div>
              <div className="text-sm text-gray-400">Languages Supported</div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-400 group-hover:scale-110 transition-transform" />
                Viral Formats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Choose from proven viral formats like Top 5 Tips, Common Errors, and Recommendations that drive engagement.
              </CardDescription>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs bg-pink-500/20 text-pink-300">Top Tips</Badge>
                <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-300">Common Errors</Badge>
                <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-300">Before/After</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400 group-hover:scale-110 transition-transform" />
                AI-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Powered by Deepseek AI to generate compelling content tailored to your business and audience.
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Generated in ~20 seconds</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2 text-indigo-400 group-hover:scale-110 transition-transform" />
                Complete Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 mb-4">
                Get viral hooks, content slides, CTAs, and image search terms all optimized for maximum engagement.
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300">Everything you need to go viral</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-white mb-8">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Choose Format</h4>
              <p className="text-gray-400 text-sm">Select from 6 proven viral formats</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Add Topic</h4>
              <p className="text-gray-400 text-sm">Optionally specify your angle</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Generate</h4>
              <p className="text-gray-400 text-sm">AI creates your viral content</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Go Viral</h4>
              <p className="text-gray-400 text-sm">Copy, download, and publish</p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-400/30 max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to go viral?</h3>
              <p className="text-gray-300 mb-6">
                Join creators using AI to generate scroll-stopping content that drives real engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/generate" className="inline-block">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 font-semibold">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Content Now
                  </Button>
                </Link>
                <Link to="/settings" className="inline-block">
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-6 py-3 font-semibold">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
