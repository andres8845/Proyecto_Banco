import { Card } from "./ui/card";
import { CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "./ui/badge";

interface AccountCardProps {
  title: string;
  balance: number;
  currency?: string;
  change?: number;
  type: "main" | "savings" | "investment";
}

export function AccountCard({ title, balance, currency = "USD", change, type }: AccountCardProps) {
  const getIcon = () => {
    switch (type) {
      case "main":
        return <CreditCard className="h-5 w-5" />;
      case "savings":
        return <TrendingUp className="h-5 w-5" />;
      case "investment":
        return <TrendingDown className="h-5 w-5" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case "main":
        return "bg-gradient-to-br from-blue-500 to-blue-700";
      case "savings":
        return "bg-gradient-to-br from-green-500 to-green-700";
      case "investment":
        return "bg-gradient-to-br from-purple-500 to-purple-700";
    }
  };

  return (
    <Card className={`${getGradient()} text-white p-6 border-0`}>
      <div className="flex justify-between items-start mb-4">
        <div className="bg-white/20 p-2 rounded-lg">
          {getIcon()}
        </div>
        {change !== undefined && (
          <Badge variant={change >= 0 ? "default" : "destructive"} className="bg-white/20 border-0">
            {change >= 0 ? "+" : ""}{change}%
          </Badge>
        )}
      </div>
      <div>
        <p className="text-white/80 text-sm mb-1">{title}</p>
        <p className="text-3xl">
          ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-white/60 text-xs mt-1">{currency}</p>
      </div>
    </Card>
  );
}
