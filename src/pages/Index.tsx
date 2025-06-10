import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Settings, BarChart3, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Glass Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20 z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight drop-shadow-2xl">
                Create Viral
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  TikTok Content
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
                AI-powered slideshow generator that creates scroll-stopping content with proven viral formats
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/generate">
                <Button size="lg" className="bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-600/90 hover:to-purple-600/90 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-2xl border-0 font-semibold rounded-xl backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:text-gray-900 transition-all duration-300 bg-white/10 hover:bg-white/90 backdrop-blur-sm text-lg px-8 py-6 font-semibold shadow-lg rounded-xl hover:scale-105">
                  <BarChart3 className="w-6 h-6 mr-2" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Everything You Need to Go Viral
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
            Professional tools and proven strategies in one powerful platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500/80 to-purple-500/80 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">AI Content Generation</h3>
            <p className="text-white/70 font-medium mb-4">
              Create scroll-stopping hooks and engaging slideshows with proven viral formats
            </p>
            <ul className="space-y-3 text-white/60">
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
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">Performance Tracking</h3>
            <p className="text-white/70 font-medium mb-4">
              Monitor your TikTok videos' performance with detailed analytics and insights
            </p>
            <ul className="space-y-3 text-white/60">
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
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500/80 to-emerald-500/80 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg backdrop-blur-sm">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white text-xl font-bold mb-3">Smart Optimization</h3>
            <p className="text-white/70 font-medium mb-4">
              Get suggestions for visual content and optimize your posting strategy
            </p>
            <ul className="space-y-3 text-white/60">
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-102">
          <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            Ready to Create Viral Content?
          </h3>
          <p className="text-white/80 text-lg mb-8 font-medium drop-shadow-md">
            Join thousands of creators using AI to generate engaging TikTok content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generate">
              <Button size="lg" className="bg-gradient-to-r from-pink-500/80 to-purple-500/80 hover:from-pink-600/90 hover:to-purple-600/90 text-white text-lg px-8 py-6 transition-all duration-300 hover:scale-105 shadow-xl border-0 font-semibold rounded-xl backdrop-blur-sm">
                <Zap className="w-5 h-5 mr-2" />
                Generate Content Now
              </Button>
            </Link>
            <Link to="/settings">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:text-gray-900 transition-all duration-300 bg-white/10 hover:bg-white/90 text-lg px-8 py-6 font-semibold shadow-lg rounded-xl hover:scale-105">
                <Settings className="w-5 h-5 mr-2" />
                Configure Settings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
