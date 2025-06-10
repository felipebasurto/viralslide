# Dashboard Features

> **⚠️ DEPRECATED**: This documentation describes the old complex TikTok API integration. The dashboard has been simplified to use manual tracking. This documentation is kept for reference only.

This document outlines the enhanced features of the ViralSlide dashboard for tracking TikTok video performance.

## Overview

The dashboard provides comprehensive analytics for your TikTok videos, including real-time metrics, historical tracking, and time-based growth analysis.

## Core Features

### 1. Content Management

- **Add Content**: Input TikTok video or photo carousel URLs to start tracking
- **URL Validation**: Automatic validation of TikTok URL formats (supports videos and photo carousels)
- **Duplicate Detection**: Prevents adding the same content multiple times
- **Bulk Operations**: Refresh all content at once

### 2. Real-time Metrics

Track essential TikTok metrics for each piece of content:

- **Views**: Total content views
- **Likes**: Number of likes received
- **Comments**: Total comments count
- **Shares**: Number of shares/reposts

### 3. Time-based Growth Tracking

Monitor growth across different time periods:

- **30 minutes**: Recent short-term growth
- **1 hour**: Hourly performance
- **2 hours**: Short-term trends
- **6 hours**: Medium-term analysis
- **24 hours**: Daily performance
- **7 days**: Weekly trends

### 4. Visual Indicators

- **Trend Icons**: Up/down arrows showing growth direction
- **Color Coding**: Green for positive growth, red for negative, gray for no change
- **Progress Badges**: Time period labels with clear formatting

### 5. Auto-refresh System

- **Automatic Updates**: Refresh all videos every 5 minutes
- **Manual Control**: Enable/disable auto-refresh
- **Individual Refresh**: Update specific videos on demand
- **Background Processing**: Non-blocking updates

## Dashboard Sections

### Stats Overview

Global statistics across all tracked content:

```
┌─────────────┬─────────────┬─────────────┐
│   Content   │ Total Views │ Total Likes │
│      5      │    2.5M     │    150K     │
└─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│Total Comments│Total Shares │Avg Engagement│
│    25K      │    75K      │    4.2%     │
└─────────────┴─────────────┴─────────────┘
```

### Auto-refresh Controls

- **Status Indicator**: Shows if auto-refresh is enabled/disabled
- **Toggle Button**: Enable or disable automatic updates
- **Refresh All**: Manual refresh for all content
- **Loading States**: Visual feedback during updates

### Content Cards

Each piece of content displays:

1. **Header Information**
   - Content title (automatically detects if it's a video or photo carousel)
   - Date added badge
   - Action buttons (copy, open, refresh, delete)

2. **Current Metrics**
   - Views, likes, comments, shares
   - Formatted numbers (K, M notation)
   - Icon-based display

3. **Time-based Growth**
   - Four metric cards (views, likes, comments, shares)
   - Growth data for each time period
   - Trend indicators

4. **Metadata**
   - Last updated timestamp
   - Quick action buttons

## API Integration

### TikTok Display API

The dashboard integrates with TikTok's official API:

- **OAuth Authentication**: Secure user authorization
- **Token Management**: Automatic token refresh
- **Rate Limiting**: Respects API limits
- **Error Handling**: Proper error messages and user feedback

### Data Flow

```
User Input → URL Validation → API Call → Data Processing → Storage → Display
     ↓
Historical Data → Growth Calculation → Time-based Metrics → Visual Updates
```

## Data Storage

### Local Storage

- **Video List**: Persistent video tracking
- **Historical Data**: Time-series metrics storage
- **User Preferences**: Auto-refresh settings
- **Authentication**: Secure token storage

### Data Structure

```typescript
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
  viewsGrowth?: TimeBasedMetrics;
  likesGrowth?: TimeBasedMetrics;
  commentsGrowth?: TimeBasedMetrics;
  sharesGrowth?: TimeBasedMetrics;
}
```

## User Experience Features

### Loading States

- **Skeleton Loading**: Placeholder content during loads
- **Progress Indicators**: Visual feedback for operations
- **Disabled States**: Clear indication of unavailable actions

### Error Handling

- **Toast Notifications**: Non-intrusive error messages
- **Retry Options**: Easy recovery from failures
- **Validation Feedback**: Clear input error messages

### Responsive Design

- **Mobile Optimized**: Works on all device sizes
- **Grid Layouts**: Adaptive metric card arrangements
- **Touch Friendly**: Large buttons and touch targets

## Performance Optimizations

### Efficient Updates

- **Batch Processing**: Multiple videos updated together
- **Debounced Requests**: Prevents excessive API calls
- **Selective Rendering**: Only update changed components

### Memory Management

- **Data Pruning**: Limit historical data storage
- **Cleanup**: Remove unused data automatically
- **Efficient Storage**: Optimized data structures

## Accessibility

### Screen Reader Support

- **Semantic HTML**: Proper heading structure
- **ARIA Labels**: Descriptive labels for interactive elements
- **Focus Management**: Keyboard navigation support

### Visual Accessibility

- **High Contrast**: Clear color distinctions
- **Large Text**: Readable font sizes
- **Color Independence**: Information not solely color-dependent

## Future Enhancements

### Planned Features

1. **Charts and Graphs**: Visual trend analysis
2. **Export Functionality**: Data export options
3. **Comparison Tools**: Video performance comparison
4. **Alerts System**: Notification for significant changes
5. **Advanced Filtering**: Sort and filter videos
6. **Bulk Import**: CSV/JSON video list import

### API Improvements

1. **Real-time WebSocket**: Live metric updates
2. **Advanced Analytics**: Deeper insights
3. **Competitor Analysis**: Compare with other videos
4. **Hashtag Tracking**: Performance by hashtags

## Troubleshooting

### Common Issues

1. **Videos Not Loading**
   - Check internet connection
   - Verify TikTok URL format
   - Check API credentials

2. **Metrics Not Updating**
   - Ensure auto-refresh is enabled
   - Check API rate limits
   - Verify authentication status

3. **Performance Issues**
   - Clear browser cache
   - Reduce number of tracked videos
   - Check available storage space

### Debug Information

Enable debug mode for detailed logging:

```javascript
localStorage.setItem('debug_dashboard', 'true');
```

This provides:
- API request/response logs
- Performance timing data
- Error stack traces
- State change notifications 