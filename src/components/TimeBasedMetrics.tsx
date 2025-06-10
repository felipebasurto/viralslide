import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimeBasedMetrics } from "@/lib/tiktok-api";

interface TimeBasedMetricsProps {
  metrics: TimeBasedMetrics;
  metricType: 'views' | 'likes' | 'comments' | 'shares';
  className?: string;
}

interface MetricConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const metricConfigs: Record<string, MetricConfig> = {
  views: {
    label: 'Views',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-blue-400',
  },
  likes: {
    label: 'Likes',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-red-400',
  },
  comments: {
    label: 'Comments',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-green-400',
  },
  shares: {
    label: 'Shares',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-yellow-400',
  },
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

const getTrendIcon = (value: number) => {
  if (value > 0) {
    return <TrendingUp className="w-3 h-3 text-green-400" />;
  } else if (value < 0) {
    return <TrendingDown className="w-3 h-3 text-red-400" />;
  }
  return <Minus className="w-3 h-3 text-gray-400" />;
};

const getTrendColor = (value: number): string => {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-gray-400';
};

const TimeBasedMetricsComponent: React.FC<TimeBasedMetricsProps> = ({
  metrics,
  metricType,
  className = '',
}) => {
  const config = metricConfigs[metricType];

  const timeRanges = [
    { key: 'last30Min', label: '30m', value: metrics.last30Min },
    { key: 'last1Hour', label: '1h', value: metrics.last1Hour },
    { key: 'last2Hours', label: '2h', value: metrics.last2Hours },
    { key: 'last6Hours', label: '6h', value: metrics.last6Hours },
    { key: 'last24Hours', label: '24h', value: metrics.last24Hours },
    { key: 'last7Days', label: '7d', value: metrics.last7Days },
  ];

  return (
    <Card className={`bg-white/10 backdrop-blur-lg border-white/20 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-sm font-medium ${config.color} flex items-center`}>
          {config.icon}
          <span className="ml-2">{config.label} Growth</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {timeRanges.map((range) => (
          <div key={range.key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className="text-xs bg-white/5 border-white/20 text-gray-300"
              >
                {range.label}
              </Badge>
              {getTrendIcon(range.value)}
            </div>
            <span className={`text-sm font-medium ${getTrendColor(range.value)}`}>
              {range.value > 0 ? '+' : ''}{formatNumber(range.value)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TimeBasedMetricsComponent; 