
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { cn } from '@/lib/utils';

interface StatChartProps {
  data: Array<{ [key: string]: string | number | boolean }>;
  dataKey: string;
  nameKey?: string;
  title?: string;
  chartType?: "line" | "bar";
  chartColor?: string;
  subtitle?: string;
  height?: number;
  className?: string;
  tooltipLabel?: string;
  tooltipFormatter?: (value: number) => string;
  gradientColor?: string;
  strokeColor?: string;
  xAxisDataKey?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  tooltipLabel,
  tooltipFormatter,
}: TooltipProps<number, string> & {
  tooltipLabel?: string;
  tooltipFormatter?: (value: number) => string;
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number;
    const formattedValue = tooltipFormatter ? tooltipFormatter(value) : value;

    return (
      <div className="rounded-md bg-white/90 dark:bg-slate-900/90 shadow-lg p-2 text-xs border border-border backdrop-blur-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        <p className="font-medium">
          {tooltipLabel || "Value"}: {formattedValue}
        </p>
      </div>
    );
  }

  return null;
};


const StatChart: React.FC<StatChartProps> = ({
  data,
  dataKey,
  nameKey,
  title,
  subtitle,
  height = 200,
  className,
  tooltipLabel,
  tooltipFormatter,
  gradientColor = "#0c96eb",
  strokeColor = "#0c96eb",
  xAxisDataKey = "name"
}) => {
  return (
    <div className={cn("w-full", className)}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey={xAxisDataKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              tickMargin={10} 
              minTickGap={5}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
              tickFormatter={(value) => tooltipFormatter ? tooltipFormatter(value) : value.toString()}
            />
            <Tooltip 
              content={<CustomTooltip tooltipLabel={tooltipLabel} tooltipFormatter={tooltipFormatter} />} 
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${dataKey})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatChart;
