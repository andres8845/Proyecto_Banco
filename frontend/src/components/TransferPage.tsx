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
  Send, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  User,
  Building2,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface TransferPageProps {
  onBack: () => void;
}

export function TransferPage({ onBack }: TransferPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [transferType, setTransferType] = useState("internal");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !fromAccount) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (transferType === "external" && (!recipientName || !recipientAccount)) {
      toast.error("Por favor completa la información del destinatario");
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      toast.success("¡Transferencia procesada exitosamente!");
    }, 2000);
  };

  const handleNewTransfer = () => {
    setStep(1);
    setAmount("");
    setFromAccount("");
    setTransferType("internal");
    setRecipientName("");
    setRecipientAccount("");
    setRecipientBank("");
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
    },
    {
      id: "investment",
      name: "Inversiones",
      number: "**** 9021",
      balance: 25750.25
    }
  ];

  const internalAccounts = [
    { id: "maria", name: "María García", account: "**** 1234" },
    { id: "carlos", name: "Carlos Rodríguez", account: "**** 5678" },
    { id: "ana", name: "Ana Martínez", account: "**** 9012" }
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
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Send className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl">Realizar Transferencia</h1>
                    <p className="text-sm text-gray-600">Envía dinero a otras cuentas</p>
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
                {/* Tipo de Transferencia */}
                <Card className="p-6">
                  <h3 className="mb-4">Tipo de Transferencia</h3>
                  <RadioGroup value={transferType} onValueChange={setTransferType}>
                    <div
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        transferType === "internal"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTransferType("internal")}
                    >
                      <RadioGroupItem value="internal" id="internal" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-3 rounded-lg ${
                          transferType === "internal" ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <User className={`h-5 w-5 ${
                            transferType === "internal" ? "text-blue-600" : "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="internal" className="cursor-pointer">
                            Entre mis cuentas
                          </Label>
                          <p className="text-xs text-gray-500">
                            Transferencia inmediata sin comisión
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        transferType === "external"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setTransferType("external")}
                    >
                      <RadioGroupItem value="external" id="external" />
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-3 rounded-lg ${
                          transferType === "external" ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                          <Building2 className={`h-5 w-5 ${
                            transferType === "external" ? "text-blue-600" : "text-gray-600"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="external" className="cursor-pointer">
                            A otra persona o banco
                          </Label>
                          <p className="text-xs text-gray-500">
                            Procesamiento 24-48 horas
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </Card>

                {/* Cuenta Origen */}
                <Card className="p-6">
                  <h3 className="mb-4">Cuenta de Origen</h3>
                  <div className="space-y-3">
                    <RadioGroup value={fromAccount} onValueChange={setFromAccount}>
                      {accounts.map((acc) => (
                        <div
                          key={acc.id}
                          className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${
                            fromAccount === acc.id
                              ? "border-blue-500 bg-blue-50"
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

                {/* Destinatario */}
                <Card className="p-6">
                  <h3 className="mb-4">
                    {transferType === "internal" ? "Cuenta Destino" : "Información del Destinatario"}
                  </h3>
                  <div className="space-y-4">
                    {transferType === "internal" ? (
                      <div className="space-y-2">
                        <Label htmlFor="toAccount">Selecciona cuenta destino</Label>
                        <Select value={recipientAccount} onValueChange={setRecipientAccount}>
                          <SelectTrigger id="toAccount">
                            <SelectValue placeholder="Selecciona una cuenta" />
                          </SelectTrigger>
                          <SelectContent>
                            {accounts
                              .filter(acc => acc.id !== fromAccount)
                              .map(acc => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.name} - {acc.number}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="recipientName">Nombre del Destinatario *</Label>
                          <Input
                            id="recipientName"
                            placeholder="Nombre completo"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recipientAccount">Número de Cuenta *</Label>
                          <Input
                            id="recipientAccount"
                            placeholder="ES00 0000 0000 0000 0000"
                            value={recipientAccount}
                            onChange={(e) => setRecipientAccount(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="recipientBank">Banco</Label>
                          <Select value={recipientBank} onValueChange={setRecipientBank}>
                            <SelectTrigger id="recipientBank">
                              <SelectValue placeholder="Selecciona un banco" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="santander">Banco Santander</SelectItem>
                              <SelectItem value="bbva">BBVA</SelectItem>
                              <SelectItem value="caixabank">CaixaBank</SelectItem>
                              <SelectItem value="sabadell">Banco Sabadell</SelectItem>
                              <SelectItem value="bankia">Bankia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {/* Monto */}
                <Card className="p-6">
                  <h3 className="mb-4">Monto a Transferir</h3>
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
                      {[50, 100, 250, 500, 1000].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          onClick={() => setAmount(value.toString())}
                          type="button"
                        >
                          ${value}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Notas */}
                <Card className="p-6">
                  <h3 className="mb-4">Concepto o Notas (Opcional)</h3>
                  <Textarea
                    placeholder="Ej: Pago de renta, regalo, etc..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </Card>
              </div>

              {/* Right Column - Summary */}
              <div className="space-y-6">
                <Card className="p-6 sticky top-24">
                  <h3 className="mb-4">Resumen</h3>
                  <Separator className="mb-4" />
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monto</span>
                      <span className="text-xl text-blue-600">
                        {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Desde</span>
                      <span className="text-sm text-right">
                        {fromAccount ? accounts.find(a => a.id === fromAccount)?.name : "-"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Para</span>
                      <span className="text-sm text-right">
                        {transferType === "internal" 
                          ? recipientAccount ? accounts.find(a => a.id === recipientAccount)?.name : "-"
                          : recipientName || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Comisión</span>
                      <span className="text-sm text-green-600">$0.00</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total</span>
                      <span className="text-lg">
                        {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                      <Clock className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600">
                        {transferType === "internal" 
                          ? "La transferencia será inmediata" 
                          : "La transferencia puede tardar 24-48 horas hábiles"}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full mt-6"
                    size="lg"
                    disabled={isProcessing || !amount || !fromAccount || (transferType === "external" && (!recipientName || !recipientAccount))}
                  >
                    {isProcessing ? (
                      "Procesando..."
                    ) : (
                      <>
                        Confirmar Transferencia
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
          <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center bg-blue-100 p-6 rounded-full mb-4">
                  <CheckCircle2 className="h-16 w-16 text-blue-600" />
                </div>
                <h1 className="text-3xl mb-2">¡Transferencia Exitosa!</h1>
                <p className="text-gray-600">Tu transferencia ha sido procesada correctamente</p>
              </div>

              <Card className="p-8 mb-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Monto transferido</p>
                  <p className="text-4xl text-blue-600">${parseFloat(amount).toFixed(2)}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Cuenta origen</span>
                    <span className="text-sm">
                      {accounts.find(a => a.id === fromAccount)?.name} - {accounts.find(a => a.id === fromAccount)?.number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Destinatario</span>
                    <span className="text-sm">
                      {transferType === "internal" 
                        ? `${accounts.find(a => a.id === recipientAccount)?.name} - ${accounts.find(a => a.id === recipientAccount)?.number}`
                        : `${recipientName} - ${recipientAccount}`}
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
                    <span className="text-sm font-mono">TRF-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Estado</span>
                    <span className="text-sm text-blue-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Completado
                    </span>
                  </div>
                </div>

                {notes && (
                  <>
                    <Separator className="my-6" />
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-600 mb-1">Concepto:</p>
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
                  onClick={handleNewTransfer}
                  className="w-full"
                >
                  Nueva Transferencia
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
