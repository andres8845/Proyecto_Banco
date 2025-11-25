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
  CreditCard, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  Phone,
  Wifi,
  Droplet,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner";

interface PaymentPageProps {
  onBack: () => void;
}

export function PaymentPage({ onBack }: PaymentPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [paymentType, setPaymentType] = useState("utility");
  const [serviceType, setServiceType] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !fromAccount || !serviceType || !reference) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      toast.success("¡Pago procesado exitosamente!");
    }, 2000);
  };

  const handleNewPayment = () => {
    setStep(1);
    setAmount("");
    setFromAccount("");
    setPaymentType("utility");
    setServiceType("");
    setReference("");
    setNotes("");
    setIsProcessing(false);
  };

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
    }
  ];

  const paymentCategories = [
    {
      id: "utility",
      name: "Servicios Básicos",
      icon: Zap,
      services: [
        { id: "electricity", name: "Electricidad", icon: Zap },
        { id: "water", name: "Agua", icon: Droplet },
        { id: "gas", name: "Gas", icon: TrendingUp }
      ]
    },
    {
      id: "telecom",
      name: "Telecomunicaciones",
      icon: Phone,
      services: [
        { id: "mobile", name: "Teléfono Móvil", icon: Phone },
        { id: "internet", name: "Internet", icon: Wifi },
        { id: "cable", name: "TV por Cable", icon: CreditCard }
      ]
    }
  ];

  const currentCategory = paymentCategories.find(c => c.id === paymentType);

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
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl">Pagar Servicios</h1>
                    <p className="text-sm text-gray-600">Paga tus facturas y servicios</p>
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
                {/* Categoría de Pago */}
                <Card className="p-6">
                  <h3 className="mb-4">Categoría del Servicio</h3>
                  <RadioGroup value={paymentType} onValueChange={setPaymentType}>
                    {paymentCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.id}
                          className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                            paymentType === category.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setPaymentType(category.id);
                            setServiceType("");
                          }}
                        >
                          <RadioGroupItem value={category.id} id={category.id} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-3 rounded-lg ${
                              paymentType === category.id ? "bg-purple-100" : "bg-gray-100"
                            }`}>
                              <Icon className={`h-5 w-5 ${
                                paymentType === category.id ? "text-purple-600" : "text-gray-600"
                              }`} />
                            </div>
                            <Label htmlFor={category.id} className="cursor-pointer">
                              {category.name}
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </Card>

                {/* Tipo de Servicio */}
                {currentCategory && (
                  <Card className="p-6">
                    <h3 className="mb-4">Selecciona el Servicio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {currentCategory.services.map((service) => {
                        const Icon = service.icon;
                        return (
                          <div
                            key={service.id}
                            className={`flex flex-col items-center gap-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                              serviceType === service.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setServiceType(service.id)}
                          >
                            <div className={`p-3 rounded-lg ${
                              serviceType === service.id ? "bg-purple-100" : "bg-gray-100"
                            }`}>
                              <Icon className={`h-6 w-6 ${
                                serviceType === service.id ? "text-purple-600" : "text-gray-600"
                              }`} />
                            </div>
                            <p className="text-sm text-center">{service.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Información del Pago */}
                <Card className="p-6">
                  <h3 className="mb-4">Información del Pago</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Número de Referencia / Cliente *</Label>
                      <Input
                        id="reference"
                        placeholder="Ingresa tu número de cliente o referencia"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto a Pagar *</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-10 h-14 text-xl"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Cuenta de Pago */}
                <Card className="p-6">
                  <h3 className="mb-4">Cuenta de Pago</h3>
                  <div className="space-y-3">
                    <RadioGroup value={fromAccount} onValueChange={setFromAccount}>
                      {accounts.map((acc) => (
                        <div
                          key={acc.id}
                          className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${
                            fromAccount === acc.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setFromAccount(acc.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={acc.id} id={`from-${acc.id}`} />
                            <div>
                              <Label htmlFor={`from-${acc.id}`} className="cursor-pointer">
                                {acc.name}
                              </Label>
                              <p className="text-sm text-gray-500">{acc.number}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Disponible</p>
                            <p className="text-sm">${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </Card>

                {/* Notas */}
                <Card className="p-6">
                  <h3 className="mb-4">Notas Adicionales (Opcional)</h3>
                  <Textarea
                    placeholder="Agrega cualquier información adicional..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </Card>
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6">
                <Card className="p-6 sticky top-24">
                  <h3 className="mb-4">Resumen del Pago</h3>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monto</span>
                      <span className="text-xl text-purple-600">
                        {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Servicio</span>
                      <span className="text-sm text-right">
                        {serviceType 
                          ? currentCategory?.services.find(s => s.id === serviceType)?.name 
                          : "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Referencia</span>
                      <span className="text-sm text-right font-mono">
                        {reference || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cuenta</span>
                      <span className="text-sm text-right">
                        {fromAccount ? accounts.find(a => a.id === fromAccount)?.name : "-"}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total a pagar</span>
                      <span className="text-lg">
                        {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xs text-purple-900">
                        El pago se procesará de inmediato y recibirás una confirmación por correo electrónico.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                    size="lg"
                    disabled={isProcessing || !amount || !fromAccount || !serviceType || !reference}
                  >
                    {isProcessing ? (
                      "Procesando..."
                    ) : (
                      <>
                        Confirmar Pago
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
          <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-purple-100 p-6 rounded-full mb-4">
                  <CheckCircle2 className="h-16 w-16 text-purple-600" />
                </div>
                <h1 className="text-3xl mb-2">¡Pago Exitoso!</h1>
                <p className="text-gray-600">Tu pago ha sido procesado correctamente</p>
              </div>

              <Card className="p-8 mb-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Monto pagado</p>
                  <p className="text-4xl text-purple-600">${parseFloat(amount).toFixed(2)}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Servicio</span>
                    <span className="text-sm">
                      {currentCategory?.services.find(s => s.id === serviceType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Número de referencia</span>
                    <span className="text-sm font-mono">{reference}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Cuenta de pago</span>
                    <span className="text-sm">
                      {accounts.find(a => a.id === fromAccount)?.name} - {accounts.find(a => a.id === fromAccount)?.number}
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
                    <span className="text-sm text-gray-600">ID de transacción</span>
                    <span className="text-sm font-mono">PAY-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Estado</span>
                    <span className="text-sm text-purple-600 flex items-center gap-1">
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
                  onClick={handleNewPayment}
                  className="w-full"
                >
                  Nuevo Pago
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
