import { Card } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ title, value, change, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl mb-1">{value}</p>
          <p className={`text-xs ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? "+" : ""}{change}% desde el mes pasado
          </p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </Card>
  );
}
