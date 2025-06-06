
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, ExternalLink, TrendingUp, Heart, MessageCircle, Eye, BarChart3, Calendar, Copy, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface TikTokVideo {
  id: string;
  url: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  dateAdded: string;
  lastUpdated: string;
}

interface TikTokStats {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagement: number;
  videoCount: number;
}

const Dashboard = () => {
  const [videos, setVideos] = useState<TikTokVideo[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load videos from localStorage on component mount
  useEffect(() => {
    const savedVideos = localStorage.getItem("tiktok_videos");
    if (savedVideos) {
      try {
        setVideos(JSON.parse(savedVideos));
      } catch (error) {
        console.error("Error loading saved videos:", error);
      }
    }
  }, []);

  // Save videos to localStorage whenever videos change
  useEffect(() => {
    localStorage.setItem("tiktok_videos", JSON.stringify(videos));
  }, [videos]);

  // Demo function to simulate fetching TikTok stats
  const simulateTikTokStats = (url: string): Omit<TikTokVideo, 'id' | 'dateAdded' | 'lastUpdated'> => {
    // Extract video identifier from URL for demo purposes
    const urlParts = url.split('/');
    const videoId = urlParts[urlParts.length - 1] || 'demo';
    
    // Generate demo stats based on URL hash for consistency
    const hash = videoId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const baseViews = Math.abs(hash % 900000) + 100000; // 100k - 1M views
    const engagementRate = (Math.abs(hash % 40) + 20) / 1000; // 2-6% engagement
    
    return {
      url,
      title: `TikTok Video ${videos.length + 1}`,
      views: baseViews,
      likes: Math.floor(baseViews * engagementRate * 0.6),
      comments: Math.floor(baseViews * engagementRate * 0.15),
      shares: Math.floor(baseViews * engagementRate * 0.25)
    };
  };

  const isValidTikTokUrl = (url: string): boolean => {
    const tiktokPattern = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)/;
    return tiktokPattern.test(url);
  };

  const addVideo = async () => {
    if (!newVideoUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a TikTok video URL.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidTikTokUrl(newVideoUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid TikTok URL (e.g., https://tiktok.com/@user/video/123...)",
        variant: "destructive"
      });
      return;
    }

    // Check if video already exists
    if (videos.some(video => video.url === newVideoUrl)) {
      toast({
        title: "Video Already Added",
        description: "This TikTok video is already in your dashboard.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you'd call the TikTok API here
      // For demo purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const videoStats = simulateTikTokStats(newVideoUrl);
      const newVideo: TikTokVideo = {
        id: Date.now().toString(),
        ...videoStats,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      setVideos(prev => [newVideo, ...prev]);
      setNewVideoUrl("");
      
      toast({
        title: "Video Added! 🎉",
        description: "TikTok video stats have been fetched and added to your dashboard."
      });
    } catch (error) {
      console.error("Error adding video:", error);
      toast({
        title: "Error",
        description: "Failed to fetch video stats. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
    toast({
      title: "Video Removed",
      description: "The video has been removed from your dashboard."
    });
  };

  const refreshVideo = async (id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video) return;

    setIsLoading(true);
    try {
      // Simulate API call to refresh stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedStats = simulateTikTokStats(video.url);
      setVideos(prev => prev.map(v => 
        v.id === id 
          ? { ...v, ...updatedStats, lastUpdated: new Date().toISOString() }
          : v
      ));
      
      toast({
        title: "Stats Refreshed",
        description: "Video statistics have been updated."
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh stats. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(label);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please try again or copy manually.",
        variant: "destructive"
      });
    }
  };

  const calculateStats = (): TikTokStats => {
    if (videos.length === 0) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        averageEngagement: 0,
        videoCount: 0
      };
    }

    const totals = videos.reduce(
      (acc, video) => ({
        views: acc.views + video.views,
        likes: acc.likes + video.likes,
        comments: acc.comments + video.comments,
        shares: acc.shares + video.shares
      }),
      { views: 0, likes: 0, comments: 0, shares: 0 }
    );

    const totalEngagements = totals.likes + totals.comments + totals.shares;
    const averageEngagement = totals.views > 0 ? (totalEngagements / totals.views) * 100 : 0;

    return {
      totalViews: totals.views,
      totalLikes: totals.likes,
      totalComments: totals.comments,
      totalShares: totals.shares,
      averageEngagement,
      videoCount: videos.length
    };
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const stats = calculateStats();

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
            TikTok Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Add Video Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center font-semibold">
              <Plus className="w-5 h-5 mr-2 text-pink-400" />
              Add TikTok Video
            </CardTitle>
            <CardDescription className="text-gray-200 font-medium">
              Enter a TikTok video URL to track its performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="tiktok-url" className="text-white text-sm mb-2 block">
                  TikTok Video URL
                </Label>
                <Input
                  id="tiktok-url"
                  placeholder="https://tiktok.com/@username/video/1234567890..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="bg-white/10 border-purple-300 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addVideo}
                  disabled={isLoading || !newVideoUrl.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? "Adding..." : "Add Video"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {videos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.videoCount}</div>
                <div className="text-xs text-gray-300">Videos</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatNumber(stats.totalViews)}</div>
                <div className="text-xs text-gray-300">Total Views</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatNumber(stats.totalLikes)}</div>
                <div className="text-xs text-gray-300">Total Likes</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatNumber(stats.totalComments)}</div>
                <div className="text-xs text-gray-300">Total Comments</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{formatNumber(stats.totalShares)}</div>
                <div className="text-xs text-gray-300">Total Shares</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-4 text-center">
                <BarChart3 className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.averageEngagement.toFixed(1)}%</div>
                <div className="text-xs text-gray-300">Avg Engagement</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Videos List */}
        {videos.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="text-center py-16">
              <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-300 text-lg mb-2">
                No TikTok videos tracked yet
              </p>
              <p className="text-gray-400 text-sm">
                Add your first TikTok video URL above to start tracking performance
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Your TikTok Videos</h2>
            {videos.map((video) => (
              <Card key={video.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-white font-medium">{video.title}</h3>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          Added {formatDate(video.dateAdded)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <Eye className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                          <div className="text-white font-semibold">{formatNumber(video.views)}</div>
                          <div className="text-xs text-gray-400">Views</div>
                        </div>
                        <div className="text-center">
                          <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                          <div className="text-white font-semibold">{formatNumber(video.likes)}</div>
                          <div className="text-xs text-gray-400">Likes</div>
                        </div>
                        <div className="text-center">
                          <MessageCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                          <div className="text-white font-semibold">{formatNumber(video.comments)}</div>
                          <div className="text-xs text-gray-400">Comments</div>
                        </div>
                        <div className="text-center">
                          <TrendingUp className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                          <div className="text-white font-semibold">{formatNumber(video.shares)}</div>
                          <div className="text-xs text-gray-400">Shares</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Last updated: {formatDate(video.lastUpdated)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(video.url, `Video ${video.id}`)}
                        className="border-purple-400/20 text-purple-300 hover:bg-purple-400/10"
                      >
                        {copiedId === `Video ${video.id}` ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(video.url, '_blank')}
                        className="border-blue-400/20 text-blue-300 hover:bg-blue-400/10"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refreshVideo(video.id)}
                        disabled={isLoading}
                        className="border-green-400/20 text-green-300 hover:bg-green-400/10"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeVideo(video.id)}
                        className="border-red-400/20 text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
