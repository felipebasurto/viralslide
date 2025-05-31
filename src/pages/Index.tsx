
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Settings, BarChart3, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight drop-shadow-lg">
                Create Viral
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  TikTok Content
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
                AI-powered slideshow generator that creates scroll-stopping content with proven viral formats
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/generate">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-2xl border-0 font-semibold">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-lg px-8 py-6 font-semibold">
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
          <p className="text-gray-200 text-lg max-w-2xl mx-auto font-medium">
            Professional tools and proven strategies in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/30 hover:bg-white/15 transition-all duration-300 group shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl font-semibold">AI Content Generation</CardTitle>
              <CardDescription className="text-gray-200 font-medium">
                Create scroll-stopping hooks and engaging slideshows with proven viral formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Viral hook generators
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Multiple proven formats
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Custom format support
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/30 hover:bg-white/15 transition-all duration-300 group shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl font-semibold">Performance Tracking</CardTitle>
              <CardDescription className="text-gray-200 font-medium">
                Monitor your TikTok videos' performance with detailed analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Views, likes, comments tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Engagement rate analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Performance comparisons
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/30 hover:bg-white/15 transition-all duration-300 group shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white text-xl font-semibold">Smart Optimization</CardTitle>
              <CardDescription className="text-gray-200 font-medium">
                Get suggestions for visual content and optimize your posting strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Image search terms
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Content length optimization
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                  Engagement insights
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-lg border-white/30 shadow-2xl">
          <CardContent className="py-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Create Viral Content?
            </h3>
            <p className="text-gray-200 text-lg mb-8 font-medium">
              Join thousands of creators using AI to generate engaging TikTok content
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/generate">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-xl border-0 font-semibold">
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Content Now
                </Button>
              </Link>
              <Link to="/settings">
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/20 transition-all duration-300 text-lg px-8 py-6 font-semibold">
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
