import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { 
  Download, 
  Banknote, 
  CreditCard, 
  Building2, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDialog({ open, onOpenChange }: DepositDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [depositMethod, setDepositMethod] = useState("transfer");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !account) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsProcessing(true);
    
    // Simular procesamiento
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      toast.success("¡Depósito procesado exitosamente!");
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    setAccount("");
    setDepositMethod("transfer");
    setNotes("");
    setIsProcessing(false);
    onOpenChange(false);
  };

  const depositMethods = [
    {
      id: "transfer",
      name: "Transferencia Bancaria",
      icon: Building2,
      description: "Desde otra cuenta bancaria"
    },
    {
      id: "cash",
      name: "Efectivo",
      icon: Banknote,
      description: "Depósito en cajero o sucursal"
    },
    {
      id: "card",
      name: "Tarjeta de Crédito/Débito",
      icon: CreditCard,
      description: "Cargo a tarjeta"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        {step === 1 ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-3 rounded-full">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <DialogTitle>Realizar Depósito</DialogTitle>
                  <DialogDescription>
                    Ingresa los detalles de tu depósito
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Selección de Cuenta */}
              <div className="space-y-2">
                <Label htmlFor="account">Cuenta de Destino *</Label>
                <Select value={account} onValueChange={setAccount}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">
                      Cuenta Principal - **** 4582
                    </SelectItem>
                    <SelectItem value="savings">
                      Cuenta de Ahorros - **** 7834
                    </SelectItem>
                    <SelectItem value="investment">
                      Inversiones - **** 9021
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Monto */}
              <div className="space-y-2">
                <Label htmlFor="amount">Monto a Depositar *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[100, 500, 1000, 5000].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(value.toString())}
                      type="button"
                    >
                      ${value}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Método de Depósito */}
              <div className="space-y-3">
                <Label>Método de Depósito *</Label>
                <RadioGroup value={depositMethod} onValueChange={setDepositMethod}>
                  {depositMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div
                        key={method.id}
                        className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          depositMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setDepositMethod(method.id)}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            depositMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              depositMethod === method.id ? "text-blue-600" : "text-gray-600"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-xs text-gray-500">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Notas Opcionales */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Agrega cualquier información adicional..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={isProcessing || !amount || !account}
              >
                {isProcessing ? (
                  "Procesando..."
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center text-center gap-3 mb-2">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">¡Depósito Exitoso!</DialogTitle>
                  <DialogDescription>
                    Tu depósito ha sido procesado correctamente
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monto depositado</span>
                  <span className="text-2xl text-green-600">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cuenta</span>
                  <span className="text-sm">
                    {account === "main" ? "Principal - **** 4582" : 
                     account === "savings" ? "Ahorros - **** 7834" : 
                     "Inversiones - **** 9021"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Método</span>
                  <span className="text-sm">
                    {depositMethods.find(m => m.id === depositMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fecha</span>
                  <span className="text-sm">
                    {new Date().toLocaleDateString('es-ES', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Número de referencia</span>
                  <span className="text-sm font-mono">DEP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>

              {notes && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-900">Notas:</p>
                  <p className="text-sm text-blue-700 mt-1">{notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  toast.success("Comprobante enviado a tu correo");
                }}
                className="flex-1"
              >
                Enviar Comprobante
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
