import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
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
  ArrowLeft,
  ArrowRight,
  Wallet,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface DepositPageProps {
  onBack: () => void;
}

export function DepositPage({ onBack }: DepositPageProps) {
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

  const handleNewDeposit = () => {
    setStep(1);
    setAmount("");
    setAccount("");
    setDepositMethod("transfer");
    setNotes("");
    setIsProcessing(false);
  };

  const depositMethods = [
    {
      id: "transfer",
      name: "Transferencia Bancaria",
      icon: Building2,
      description: "Desde otra cuenta bancaria",
      processingTime: "Inmediato"
    },
    {
      id: "cash",
      name: "Efectivo",
      icon: Banknote,
      description: "Depósito en cajero o sucursal",
      processingTime: "1-2 horas"
    },
    {
      id: "card",
      name: "Tarjeta de Crédito/Débito",
      icon: CreditCard,
      description: "Cargo a tarjeta",
      processingTime: "Inmediato"
    }
  ];

  const accounts = [
    {
      id: "main",
      name: "Cuenta Principal",
      number: "**** 4582",
      balance: 12458.50
    },
    {
      id: "savings",
      name: "Cuenta de Ahorros",
      number: "**** 7834",
      balance: 8320.00
    },
    {
      id: "investment",
      name: "Inversiones",
      number: "**** 9021",
      balance: 25750.25
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 1 ? (
        <>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl">Realizar Depósito</h1>
                    <p className="text-sm text-gray-600">Completa la información para tu depósito</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Selección de Cuenta */}
                <Card className="p-6">
                  <h3 className="mb-4">Cuenta de Destino</h3>
                  <div className="space-y-3">
                    <RadioGroup value={account} onValueChange={setAccount}>
                      {accounts.map((acc) => (
                        <div
                          key={acc.id}
                          className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${
                            account === acc.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setAccount(acc.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={acc.id} id={acc.id} />
                            <div>
                              <Label htmlFor={acc.id} className="cursor-pointer">
                                {acc.name}
                              </Label>
                              <p className="text-sm text-gray-500">{acc.number}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Saldo actual</p>
                            <p className="text-sm">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </Card>

                {/* Monto */}
                <Card className="p-6">
                  <h3 className="mb-4">Monto a Depositar</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 h-16 text-2xl"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {[100, 500, 1000, 5000, 10000].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          onClick={() => setAmount(value.toString())}
                          type="button"
                        >
                          ${value.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Método de Depósito */}
                <Card className="p-6">
                  <h3 className="mb-4">Método de Depósito</h3>
                  <div className="space-y-3">
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
                            <RadioGroupItem value={method.id} id={`method-${method.id}`} />
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-3 rounded-lg ${
                                depositMethod === method.id ? "bg-blue-100" : "bg-gray-100"
                              }`}>
                                <Icon className={`h-6 w-6 ${
                                  depositMethod === method.id ? "text-blue-600" : "text-gray-600"
                                }`} />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor={`method-${method.id}`} className="cursor-pointer">
                                  {method.name}
                                </Label>
                                <p className="text-xs text-gray-500">
                                  {method.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {method.processingTime}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </Card>

                {/* Notas Opcionales */}
                <Card className="p-6">
                  <h3 className="mb-4">Notas Adicionales (Opcional)</h3>
                  <Textarea
                    placeholder="Agrega cualquier información adicional sobre este depósito..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </Card>
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6">
                <Card className="p-6 sticky top-24">
                  <h3 className="mb-4">Resumen del Depósito</h3>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monto</span>
                      <span className="text-xl text-green-600">
                        {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cuenta destino</span>
                      <span className="text-sm">
                        {account ? accounts.find(a => a.id === account)?.name : "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Método</span>
                      <span className="text-sm">
                        {depositMethods.find(m => m.id === depositMethod)?.name}
                      </span>
                    </div>

                    {account && amount && (
                      <>
                        <Separator />
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-900 mb-1">Nuevo saldo estimado</p>
                          <p className="text-lg text-blue-700">
                            ${(accounts.find(a => a.id === account)!.balance + parseFloat(amount || "0")).toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full mt-6"
                    size="lg"
                    disabled={isProcessing || !amount || !account}
                  >
                    {isProcessing ? (
                      "Procesando..."
                    ) : (
                      <>
                        Confirmar Depósito
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Success Screen */}
          <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-green-100 p-6 rounded-full mb-4">
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <h1 className="text-3xl mb-2">¡Depósito Exitoso!</h1>
                <p className="text-gray-600">Tu depósito ha sido procesado correctamente</p>
              </div>

              <Card className="p-8 mb-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Monto depositado</p>
                  <p className="text-4xl text-green-600">${parseFloat(amount).toFixed(2)}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Cuenta destino</span>
                    <span className="text-sm">
                      {accounts.find(a => a.id === account)?.name} - {accounts.find(a => a.id === account)?.number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Método de depósito</span>
                    <span className="text-sm">
                      {depositMethods.find(m => m.id === depositMethod)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Fecha y hora</span>
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
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Número de referencia</span>
                    <span className="text-sm font-mono">DEP-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Estado</span>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Completado
                    </span>
                  </div>
                </div>

                {notes && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Notas:</p>
                      <p className="text-sm text-gray-800">{notes}</p>
                    </div>
                  </>
                )}
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success("Comprobante enviado a tu correo");
                  }}
                  className="w-full"
                >
                  Enviar Comprobante
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNewDeposit}
                  className="w-full"
                >
                  Nuevo Depósito
                </Button>
                <Button
                  onClick={onBack}
                  className="w-full"
                >
                  Volver al Dashboard
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
