# TikTok API Setup Guide

> **⚠️ DEPRECATED**: This TikTok API integration has been deprecated due to complexity and API limitations. The application now uses a simplified manual tracking approach. This documentation is kept for reference only.

This guide explains how to set up TikTok API integration for ViralSlide to track real TikTok video metrics.

## Overview

ViralSlide uses the TikTok Display API to fetch statistics for videos and photo carousels, along with user information.

## Prerequisites

- A TikTok account
- Access to TikTok for Developers platform
- Basic understanding of OAuth 2.0 flow

## Step 1: Create a TikTok Developer Account

1. Visit [TikTok for Developers](https://developers.tiktok.com/)
2. Click "Get Started" and sign in with your TikTok account
3. Complete the developer registration process
4. Verify your email address

## Step 2: Register Your Application

1. Go to the [TikTok Developer Portal](https://developers.tiktok.com/apps/)
2. Click "Create an App"
3. Fill in the application details:
   - **App Name**: ViralSlide (or your preferred name)
   - **App Description**: Personal TikTok analytics dashboard for videos and photo carousels
   - **Category**: Analytics & Data
   - **Platform**: Web
4. Submit your application for review

## Step 3: Configure App Settings

Once your app is approved:

1. Navigate to your app in the developer portal
2. Go to "App Info" section
3. Note down your:
   - **Client Key** (App ID)
   - **Client Secret**
4. Set up redirect URIs:
   - For development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

## Step 4: Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# TikTok API Configuration
VITE_TIKTOK_CLIENT_KEY=your_client_key_here
VITE_TIKTOK_CLIENT_SECRET=your_client_secret_here
VITE_TIKTOK_REDIRECT_URI=http://localhost:5173/auth/callback
```

**Important**: Never commit your `.env` file to version control. Add it to your `.gitignore` file.

## Step 5: API Scopes and Permissions

The app requests the following scopes:
- `user.info.basic` - Access to basic user information
- `video.list` - Access to user's video list
- `video.upload` - Future feature for uploading videos

## Step 6: Authentication Flow

The app implements OAuth 2.0 authorization code flow:

1. User clicks "Connect TikTok" button
2. Redirected to TikTok authorization page
3. User grants permissions
4. TikTok redirects back with authorization code
5. App exchanges code for access token
6. Access token is stored securely in localStorage

## API Limitations and Considerations

### Current Limitations

1. **Real-time Statistics**: TikTok's public APIs don't provide real-time view counts for individual videos or photo carousels
2. **Rate Limits**: API calls are rate-limited (specific limits depend on your app's approval status)
3. **Data Freshness**: Content statistics may not be real-time and could have delays

### Alternative Solutions

For production use with real-time data, consider:

1. **TikTok Research API**: Requires special approval but provides more comprehensive data
2. **Third-party Services**: Services like Social Blade or TikTok Analytics APIs

## Troubleshooting

### Common Issues

1. **Invalid Client Credentials**
   - Verify your Client Key and Client Secret
   - Ensure environment variables are properly set

2. **Redirect URI Mismatch**
   - Check that your redirect URI matches exactly what's configured in the developer portal
   - Include protocol (http/https) and port if applicable

3. **Scope Permissions**
   - Ensure your app has been approved for the required scopes
   - Some scopes require additional review

4. **Rate Limiting**
   - Implement exponential backoff for failed requests
   - Cache responses when possible
   - Use batch operations

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
VITE_DEBUG_TIKTOK_API=true
```

This will log API requests and responses to the browser console.

## Security Best Practices

1. **Environment Variables**: Never expose API credentials in client-side code
2. **Token Storage**: Consider using secure storage methods for production
3. **HTTPS**: Always use HTTPS in production
4. **Token Refresh**: Implement proper token refresh logic
5. **Error Handling**: Don't expose sensitive error information to users

## Testing

### Development Testing

1. Use TikTok's sandbox environment if available
2. Test with your own TikTok account first
3. Verify all OAuth flows work correctly

## Production Deployment

### Environment Setup

1. Set production environment variables
2. Update redirect URIs in TikTok developer portal
3. Configure HTTPS
4. Set up proper error monitoring

### Monitoring

Monitor the following metrics:
- API response times
- Error rates
- Token refresh success rates
- User authentication success rates

## Support and Resources

- [TikTok for Developers Documentation](https://developers.tiktok.com/doc/overview)
- [TikTok API Reference](https://developers.tiktok.com/doc/display-api-get-started)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)

## Changelog

- **v1.0.0**: Initial TikTok API integration
- **v1.1.0**: Added time-based metrics tracking
- **v1.2.0**: Enhanced error handling 