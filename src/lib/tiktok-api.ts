/**
 * @deprecated This TikTok API integration is deprecated due to complexity and API limitations.
 * The dashboard now uses a simplified manual tracking approach.
 * This file is kept for reference but is not actively used in the application.
 */

// TikTok API Configuration and Service
// Note: This requires TikTok Research API access which is difficult to obtain
// The application has been simplified to use manual metric tracking instead

interface TikTokConfig {
  clientKey: string;
  clientSecret: string;
  redirectUri: string;
}

interface TikTokTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface TikTokVideoData {
  id: string;
  title: string;
  description: string;
  duration: number;
  cover_image_url: string;
  video_description: string;
  create_time: number;
  share_url: string;
}

interface TikTokVideoStats {
  video_id: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  timestamp: number;
}

interface TikTokUserInfo {
  open_id: string;
  union_id: string;
  avatar_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

interface TimeBasedMetrics {
  last30Min: number;
  last1Hour: number;
  last2Hours: number;
  last6Hours: number;
  last24Hours: number;
  last7Days: number;
}

interface EnhancedVideoMetrics extends TikTokVideoStats {
  viewsGrowth: TimeBasedMetrics;
  likesGrowth: TimeBasedMetrics;
  commentsGrowth: TimeBasedMetrics;
  sharesGrowth: TimeBasedMetrics;
}

class TikTokAPIService {
  private config: TikTokConfig;
  private baseUrl = 'https://open.tiktokapis.com';
  
  constructor(config: TikTokConfig) {
    this.config = config;
    console.warn('TikTok API Service is deprecated. Use manual tracking instead.');
  }

  /**
   * Generate OAuth authorization URL for TikTok login
   */
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.config.clientKey,
      scope: 'user.info.basic,video.list,video.upload',
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      state: state
    });

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<TikTokTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/oauth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.config.clientKey,
          client_secret: this.config.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.config.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Token exchange error: ${data.error_description || data.error}`);
      }

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw new Error('Failed to authenticate with TikTok');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<TikTokTokens> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/oauth/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.config.clientKey,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Token refresh error: ${data.error_description || data.error}`);
      }

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh TikTok token');
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`User info error: ${data.error.message}`);
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user information');
    }
  }

  /**
   * Get user's videos list
   */
  async getUserVideos(accessToken: string, cursor?: string, maxCount: number = 20): Promise<{ videos: TikTokVideoData[], cursor: string, hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        fields: 'id,title,video_description,duration,cover_image_url,create_time,share_url',
        max_count: maxCount.toString(),
      });

      if (cursor) {
        params.append('cursor', cursor);
      }

      const response = await fetch(`${this.baseUrl}/v2/video/list/?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Videos error: ${data.error.message}`);
      }

      return {
        videos: data.data.videos || [],
        cursor: data.data.cursor || '',
        hasMore: data.data.has_more || false,
      };
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw new Error('Failed to fetch videos');
    }
  }

  /**
   * Extract content ID from TikTok URL (supports both videos and photo carousels)
   */
  extractVideoIdFromUrl(url: string): string | null {
    try {
      // Handle different TikTok URL formats including photo carousels
      const patterns = [
        /tiktok\.com\/@[^/]+\/video\/(\d+)/,        // Regular videos
        /tiktok\.com\/@[^/]+\/photo\/(\d+)/,        // Photo carousels
        /vm\.tiktok\.com\/([A-Za-z0-9]+)/,          // Short URLs
        /tiktok\.com\/t\/([A-Za-z0-9]+)/,           // Alternative short URLs
        /tiktok\.com\/@[^/]+\/post\/(\d+)/,         // Alternative post format
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting content ID:', error);
      return null;
    }
  }

  /**
   * Get video statistics
   * Note: TikTok Display API doesn't provide real-time stats for individual videos
   * This requires TikTok's Research API or other approved methods
   */
  async getVideoStats(videoId: string, accessToken: string): Promise<TikTokVideoStats> {
    throw new Error('TikTok video stats require Research API access. Please configure proper API credentials.');
  }

  /**
   * Calculate time-based metrics growth
   */
  calculateTimeBasedGrowth(historicalData: TikTokVideoStats[]): TimeBasedMetrics {
    const now = Date.now();
    const timeRanges = {
      last30Min: 30 * 60 * 1000,
      last1Hour: 60 * 60 * 1000,
      last2Hours: 2 * 60 * 60 * 1000,
      last6Hours: 6 * 60 * 60 * 1000,
      last24Hours: 24 * 60 * 60 * 1000,
      last7Days: 7 * 24 * 60 * 60 * 1000,
    };

    const result: TimeBasedMetrics = {
      last30Min: 0,
      last1Hour: 0,
      last2Hours: 0,
      last6Hours: 0,
      last24Hours: 0,
      last7Days: 0,
    };

    // Sort data by timestamp
    const sortedData = historicalData.sort((a, b) => a.timestamp - b.timestamp);
    
    if (sortedData.length < 2) {
      return result;
    }

    const latestData = sortedData[sortedData.length - 1];

    Object.entries(timeRanges).forEach(([key, timeRange]) => {
      const cutoffTime = now - timeRange;
      const dataAtCutoff = sortedData.find(data => data.timestamp >= cutoffTime);
      
      if (dataAtCutoff) {
        result[key as keyof TimeBasedMetrics] = latestData.view_count - dataAtCutoff.view_count;
      }
    });

    return result;
  }

  /**
   * Store historical data in localStorage
   */
  storeHistoricalData(videoId: string, stats: TikTokVideoStats): void {
    try {
      const key = `tiktok_history_${videoId}`;
      const existing = localStorage.getItem(key);
      const history: TikTokVideoStats[] = existing ? JSON.parse(existing) : [];
      
      // Add new data point
      history.push(stats);
      
      // Keep only last 100 data points to prevent storage bloat
      if (history.length > 100) {
        history.splice(0, history.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('Error storing historical data:', error);
    }
  }

  /**
   * Get historical data from localStorage
   */
  getHistoricalData(videoId: string): TikTokVideoStats[] {
    try {
      const key = `tiktok_history_${videoId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving historical data:', error);
      return [];
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(tokens: TikTokTokens): boolean {
    return Date.now() >= tokens.expiresAt - 60000; // 1 minute buffer
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    try {
      const tokensData = localStorage.getItem('tiktok_tokens');
      if (!tokensData) {
        return null;
      }

      const tokens: TikTokTokens = JSON.parse(tokensData);
      
      if (this.isTokenExpired(tokens)) {
        const newTokens = await this.refreshAccessToken(tokens.refreshToken);
        localStorage.setItem('tiktok_tokens', JSON.stringify(newTokens));
        return newTokens.accessToken;
      }

      return tokens.accessToken;
    } catch (error) {
      console.error('Error getting valid access token:', error);
      localStorage.removeItem('tiktok_tokens');
      return null;
    }
  }
}

// Export singleton instance
export const tiktokAPI = new TikTokAPIService({
  clientKey: import.meta.env.VITE_TIKTOK_CLIENT_KEY || '',
  clientSecret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_TIKTOK_REDIRECT_URI || `${window.location.origin}/auth/callback`,
});

export type {
  TikTokConfig,
  TikTokTokens,
  TikTokVideoData,
  TikTokVideoStats,
  TikTokUserInfo,
  TimeBasedMetrics,
  EnhancedVideoMetrics,
}; 