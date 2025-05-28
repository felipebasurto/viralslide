
import { useState } from "react";
import { Settings, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          <Link to="/generate">
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105">
              <Zap className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pink-400" />
                Viral Formats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Choose from proven viral formats like Top 5 Tips, Common Errors, and Recommendations that drive engagement.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                AI-Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Powered by Deepseek AI to generate compelling content tailored to your business and audience.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-indigo-400" />
                Image Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Get search terms for finding viral images to complement your slideshow content.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Ready to go viral?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/settings" className="inline-block">
              <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300">
                Configure Settings
              </Button>
            </Link>
            <Link to="/generate" className="inline-block">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Generate Content
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
