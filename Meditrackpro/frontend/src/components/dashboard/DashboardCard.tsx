
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  footer,
  className,
  contentClassName,
  children,
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 h-full card-hover", 
      className
    )}>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className={cn("px-4 md:px-6 pt-0", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="p-4 md:p-6 pt-0 flex-wrap gap-2">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default DashboardCard;
