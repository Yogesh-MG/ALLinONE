
import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface CustomProgressProps {
  value: number;
  className?: string;
  indicatorColor?: string;
}

const CustomProgress = ({ value, className, indicatorColor }: CustomProgressProps) => {
  return (
    <Progress 
      value={value} 
      className={className}
      style={{ 
        "--indicator-color": indicatorColor 
      } as React.CSSProperties}
    />
  );
};

export { CustomProgress };
