
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Settings, BarChart3, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Create Viral
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                  TikTok Content
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                AI-powered slideshow generator that creates scroll-stopping content with proven viral formats
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/generate">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-2xl border-0 font-semibold">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg px-8 py-6 font-semibold">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Go Viral
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional tools and proven strategies in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800 hover:border-pink-500/50 transition-all duration-300 group hover:bg-gray-800">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl">AI Content Generation</CardTitle>
              <CardDescription className="text-gray-400">
                Create scroll-stopping hooks and engaging slideshows with proven viral formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Viral hook generators
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Multiple proven formats
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Custom format support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-pink-500/50 transition-all duration-300 group hover:bg-gray-800">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Performance Tracking</CardTitle>
              <CardDescription className="text-gray-400">
                Monitor your TikTok videos' performance with detailed analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Views, likes, comments tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Engagement rate analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Performance comparisons
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 hover:border-pink-500/50 transition-all duration-300 group hover:bg-gray-800">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl">Smart Optimization</CardTitle>
              <CardDescription className="text-gray-400">
                Get suggestions for visual content and optimize your posting strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Image search terms
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Content length optimization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                  Engagement insights
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <Card className="bg-gray-900 border-gray-800 border-2">
          <CardContent className="py-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Create Viral Content?
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of creators using AI to generate engaging TikTok content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generate">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-xl border-0 font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Content Now
                </Button>
              </Link>
              <Link to="/settings">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-lg px-8 py-6 font-semibold">
                  <Settings className="w-5 h-5 mr-2" />
                  Configure Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
