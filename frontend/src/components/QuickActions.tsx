import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Send, Download, CreditCard, PieChart } from "lucide-react";

interface QuickActionsProps {
  onDepositClick: () => void;
  onTransferClick: () => void;
  onPaymentClick: () => void;
  onAnalyticsClick: () => void;
}

export function QuickActions({ onDepositClick, onTransferClick, onPaymentClick, onAnalyticsClick }: QuickActionsProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Acciones Rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-auto flex-col gap-2 py-4"
          onClick={onTransferClick}
        >
          <Send className="h-5 w-5" />
          <span className="text-xs">Transferir</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex-col gap-2 py-4"
          onClick={onDepositClick}
        >
          <Download className="h-5 w-5" />
          <span className="text-xs">Depositar</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex-col gap-2 py-4"
          onClick={onPaymentClick}
        >
          <CreditCard className="h-5 w-5" />
          <span className="text-xs">Pagar</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto flex-col gap-2 py-4"
          onClick={onAnalyticsClick}
        >
          <PieChart className="h-5 w-5" />
          <span className="text-xs">Analíticas</span>
        </Button>
      </div>
    </Card>
  );
}
