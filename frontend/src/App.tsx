import { AccountCard } from "./components/AccountCard";
import { RecentTransactions } from "./components/RecentTransactions";
import { SpendingChart } from "./components/SpendingChart";
import { QuickActions } from "./components/QuickActions";
import { StatsCard } from "./components/StatsCard";
import { UserProfile } from "./components/UserProfile";
import { DepositPage } from "./components/DepositPage";
import { TransferPage } from "./components/TransferPage";
import { PaymentPage } from "./components/PaymentPage";
import { AnalyticsPage } from "./components/AnalyticsPage";
import { Bell, User, Search, TrendingUp, Wallet, CreditCard, PiggyBank, LayoutDashboard, UserCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Toaster } from "./components/ui/sonner";
import { useState } from "react";

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "profile" | "deposit" | "transfer" | "payment" | "analytics">("dashboard");

  if (currentView === "deposit") {
    return (
      <>
        <DepositPage onBack={() => setCurrentView("dashboard")} />
        <Toaster position="top-right" />
      </>
    );
  }

  if (currentView === "transfer") {
    return (
      <>
        <TransferPage onBack={() => setCurrentView("dashboard")} />
        <Toaster position="top-right" />
      </>
    );
  }

  if (currentView === "payment") {
    return (
      <>
        <PaymentPage onBack={() => setCurrentView("dashboard")} />
        <Toaster position="top-right" />
      </>
    );
  }

  if (currentView === "analytics") {
    return (
      <>
        <AnalyticsPage onBack={() => setCurrentView("dashboard")} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl">BancoDigital</h1>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant={currentView === "dashboard" ? "default" : "ghost"}
                onClick={() => setCurrentView("dashboard")}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button 
                variant={currentView === "profile" ? "default" : "ghost"}
                onClick={() => setCurrentView("profile")}
                className="gap-2"
              >
                <UserCircle className="h-4 w-4" />
                Mi Perfil
              </Button>
            </div>

            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar transacciones..." 
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Avatar 
                className="cursor-pointer"
                onClick={() => setCurrentView("profile")}
              >
                <AvatarFallback className="bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" ? (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-2xl mb-1">Bienvenido de nuevo, Juan</h2>
              <p className="text-gray-600">Aquí está un resumen de tus finanzas</p>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AccountCard 
                title="Cuenta Principal"
                balance={12458.50}
                currency="USD"
                change={2.5}
                type="main"
              />
              <AccountCard 
                title="Cuenta de Ahorros"
                balance={8320.00}
                currency="USD"
                change={5.2}
                type="savings"
              />
              <AccountCard 
                title="Inversiones"
                balance={25750.25}
                currency="USD"
                change={-1.3}
                type="investment"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Gastos del Mes"
                value="$3,842.50"
                change={-12.5}
                icon={TrendingUp}
                iconColor="bg-red-500"
              />
              <StatsCard 
                title="Ingresos del Mes"
                value="$5,240.00"
                change={8.2}
                icon={Wallet}
                iconColor="bg-green-500"
              />
              <StatsCard 
                title="Total Ahorrado"
                value="$34,070.25"
                change={15.7}
                icon={PiggyBank}
                iconColor="bg-blue-500"
              />
            </div>

            {/* Chart and Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SpendingChart />
              </div>
              <div>
                <QuickActions 
                  onDepositClick={() => setCurrentView("deposit")}
                  onTransferClick={() => setCurrentView("transfer")}
                  onPaymentClick={() => setCurrentView("payment")}
                  onAnalyticsClick={() => setCurrentView("analytics")}
                />
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <RecentTransactions />
            </div>
          </>
        ) : (
          <>
            {/* Profile Header */}
            <div className="mb-8">
              <h2 className="text-2xl mb-1">Mi Perfil</h2>
              <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
            </div>
            
            {/* Profile Content */}
            <UserProfile />
          </>
        )}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
