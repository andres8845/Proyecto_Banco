import { Card } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Coffee, Zap, Wifi } from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  icon: "shopping" | "coffee" | "utilities" | "wifi";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    merchant: "Transferencia recibida",
    category: "Salario",
    amount: 3500.00,
    type: "income",
    date: "Hoy, 10:30 AM",
    icon: "shopping"
  },
  {
    id: "2",
    merchant: "Amazon",
    category: "Compras",
    amount: 127.50,
    type: "expense",
    date: "Ayer, 3:45 PM",
    icon: "shopping"
  },
  {
    id: "3",
    merchant: "Starbucks",
    category: "Alimentos",
    amount: 8.75,
    type: "expense",
    date: "Ayer, 9:20 AM",
    icon: "coffee"
  },
  {
    id: "4",
    merchant: "Luz y Gas",
    category: "Servicios",
    amount: 156.30,
    type: "expense",
    date: "03 Nov, 2025",
    icon: "utilities"
  },
  {
    id: "5",
    merchant: "Internet",
    category: "Servicios",
    amount: 49.99,
    type: "expense",
    date: "02 Nov, 2025",
    icon: "wifi"
  }
];

const getIcon = (icon: string) => {
  switch (icon) {
    case "shopping":
      return <ShoppingCart className="h-4 w-4" />;
    case "coffee":
      return <Coffee className="h-4 w-4" />;
    case "utilities":
      return <Zap className="h-4 w-4" />;
    case "wifi":
      return <Wifi className="h-4 w-4" />;
    default:
      return <ShoppingCart className="h-4 w-4" />;
  }
};

export function RecentTransactions() {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Transacciones Recientes</h3>
      <div className="space-y-4">
        {mockTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={transaction.type === "income" ? "bg-green-100" : "bg-gray-100"}>
                  {getIcon(transaction.icon)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm">{transaction.merchant}</p>
                <p className="text-xs text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <p className={`text-sm ${transaction.type === "income" ? "text-green-600" : "text-gray-900"}`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{transaction.category}</p>
              </div>
              {transaction.type === "income" ? (
                <ArrowDownRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
