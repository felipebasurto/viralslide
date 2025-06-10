import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, ExternalLink, TrendingUp, Heart, MessageCircle, Eye, BarChart3, Calendar, Copy, CheckCircle2, RefreshCw, Edit3 } from "lucide-react";
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
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editMetrics, setEditMetrics] = useState({
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0
  });
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

    // Check if content already exists
    if (videos.some(video => video.url === newVideoUrl)) {
      toast({
        title: "Content Already Added",
        description: "This TikTok content is already in your dashboard.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simple delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));

      // Determine content type from URL
      const isPhotoCarousel = newVideoUrl.includes('/photo/');
      const contentType = isPhotoCarousel ? 'Photo Carousel' : 'Video';
      
      const newVideo: TikTokVideo = {
        id: Date.now().toString(),
        url: newVideoUrl,
        title: newVideoTitle.trim() || `TikTok ${contentType} ${videos.length + 1}`,
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      setVideos(prev => [newVideo, ...prev]);
      setNewVideoUrl("");
      setNewVideoTitle("");
      
      toast({
        title: "Content Added! 🎉",
        description: "TikTok content has been added to your dashboard. Click edit to update metrics."
      });
    } catch (error) {
      console.error("Error adding video:", error);
      toast({
        title: "Error",
        description: "Failed to add content. Please try again.",
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

  const startEditingMetrics = (video: TikTokVideo) => {
    setEditingVideo(video.id);
    setEditMetrics({
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      shares: video.shares
    });
  };

  const saveMetrics = (id: string) => {
    setVideos(prev => prev.map(v => 
      v.id === id 
        ? { 
            ...v, 
            views: editMetrics.views,
            likes: editMetrics.likes,
            comments: editMetrics.comments,
            shares: editMetrics.shares,
            lastUpdated: new Date().toISOString() 
          }
        : v
    ));
    
    setEditingVideo(null);
    toast({
      title: "Metrics Updated",
      description: "Content metrics have been saved."
    });
  };

  const cancelEditing = () => {
    setEditingVideo(null);
    setEditMetrics({ views: 0, likes: 0, comments: 0, shares: 0 });
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
            Content Tracker
          </h1>
          <Badge variant="secondary" className="bg-green-500/20 text-green-200 border-green-400/30">
            Manual Tracking
          </Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Add Video Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center font-semibold">
              <Plus className="w-5 h-5 mr-2 text-pink-400" />
              Add TikTok Content
            </CardTitle>
            <CardDescription className="text-gray-200 font-medium">
              Add your TikTok content and manually track its performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tiktok-url" className="text-white text-sm mb-2 block">
                  TikTok Content URL
                </Label>
                <Input
                  id="tiktok-url"
                  placeholder="https://tiktok.com/@username/video/123..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="bg-white/10 border-purple-300 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="video-title" className="text-white text-sm mb-2 block">
                  Content Title (Optional)
                </Label>
                <Input
                  id="video-title"
                  placeholder="My viral TikTok video"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  className="bg-white/10 border-purple-300 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={addVideo}
                disabled={isLoading || !newVideoUrl.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add Content"}
              </Button>
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
                <div className="text-xs text-gray-300">Content</div>
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
                <TrendingUp className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.averageEngagement.toFixed(1)}%</div>
                <div className="text-xs text-gray-300">Avg Engagement</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Videos List */}
        {videos.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Content Yet</h3>
              <p className="text-gray-300">Add your first TikTok content to start tracking its performance.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <Card key={video.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{video.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-300">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Added: {formatDate(video.dateAdded)}
                        </span>
                        <span className="flex items-center">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Updated: {formatDate(video.lastUpdated)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(video.url, `Video ${video.id}`)}
                        className="border-white/20 text-white hover:bg-white/20"
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
                        className="border-white/20 text-white hover:bg-white/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditingMetrics(video)}
                        className="border-white/20 text-white hover:bg-white/20"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeVideo(video.id)}
                        className="border-red-400/40 text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {editingVideo === video.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-white text-sm">Views</Label>
                          <Input
                            type="number"
                            value={editMetrics.views}
                            onChange={(e) => setEditMetrics(prev => ({ ...prev, views: parseInt(e.target.value) || 0 }))}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-sm">Likes</Label>
                          <Input
                            type="number"
                            value={editMetrics.likes}
                            onChange={(e) => setEditMetrics(prev => ({ ...prev, likes: parseInt(e.target.value) || 0 }))}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-sm">Comments</Label>
                          <Input
                            type="number"
                            value={editMetrics.comments}
                            onChange={(e) => setEditMetrics(prev => ({ ...prev, comments: parseInt(e.target.value) || 0 }))}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-sm">Shares</Label>
                          <Input
                            type="number"
                            value={editMetrics.shares}
                            onChange={(e) => setEditMetrics(prev => ({ ...prev, shares: parseInt(e.target.value) || 0 }))}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => saveMetrics(video.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditing}
                          className="border-white/20 text-white hover:bg-white/20"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  )}
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
