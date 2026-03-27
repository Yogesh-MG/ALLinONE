
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  loading?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  change,
  trend = 'neutral',
  trendText,
  loading = false,
  className,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden border transition-all duration-300 hover:shadow-soft-md hover:-translate-y-1", 
      className
    )}>
      <CardContent className="p-6">
        {loading ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-28 mb-2" />
            <Skeleton className="h-4 w-24" />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                {icon}
              </div>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {(change !== undefined || trendText) && (
              <div className="mt-2 flex items-center text-xs">
                {change !== undefined && trend !== 'neutral' && (
                  <div className={cn(
                    "mr-1 flex items-center rounded-sm p-0.5",
                    trend === 'up' && "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                    trend === 'down' && "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    <span className="ml-0.5">{Math.abs(change)}%</span>
                  </div>
                )}
                <span className="text-muted-foreground">{trendText || "vs. previous period"}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
