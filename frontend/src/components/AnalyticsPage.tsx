import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Coffee,
  Home,
  Car,
  Smartphone,
  Heart,
  Calendar
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

interface AnalyticsPageProps {
  onBack: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const [period, setPeriod] = useState("month");

  const categoryData = [
    { name: "Compras", value: 1250, color: "#3b82f6", icon: ShoppingCart },
    { name: "Alimentos", value: 890, color: "#10b981", icon: Coffee },
    { name: "Vivienda", value: 1500, color: "#f59e0b", icon: Home },
    { name: "Transporte", value: 650, color: "#ef4444", icon: Car },
    { name: "Tecnología", value: 420, color: "#8b5cf6", icon: Smartphone },
    { name: "Salud", value: 280, color: "#ec4899", icon: Heart }
  ];

  const monthlyTrend = [
    { month: "Ene", ingresos: 4200, gastos: 3100 },
    { month: "Feb", ingresos: 3800, gastos: 2900 },
    { month: "Mar", ingresos: 4500, gastos: 3500 },
    { month: "Abr", ingresos: 4100, gastos: 3200 },
    { month: "May", ingresos: 4800, gastos: 3800 },
    { month: "Jun", ingresos: 5000, gastos: 4200 }
  ];

  const weeklySpending = [
    { day: "Lun", amount: 125 },
    { day: "Mar", amount: 89 },
    { day: "Mié", amount: 156 },
    { day: "Jue", amount: 97 },
    { day: "Vie", amount: 234 },
    { day: "Sáb", amount: 312 },
    { day: "Dom", amount: 187 }
  ];

  const totalGastos = categoryData.reduce((sum, item) => sum + item.value, 0);
  const ingresosMensuales = 5000;
  const ahorroMensual = ingresosMensuales - totalGastos;
  const tasaAhorro = (ahorroMensual / ingresosMensuales * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
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
                <div className="bg-orange-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl">Analíticas Financieras</h1>
                  <p className="text-sm text-gray-600">Análisis detallado de tus finanzas</p>
                </div>
              </div>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Ingresos</p>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl mb-1">${ingresosMensuales.toLocaleString()}</p>
            <p className="text-xs text-green-600">+8.2% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Gastos</p>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-2xl mb-1">${totalGastos.toLocaleString()}</p>
            <p className="text-xs text-red-600">+12.5% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Ahorro</p>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl mb-1">${ahorroMensual.toLocaleString()}</p>
            <p className="text-xs text-blue-600">Meta: $1,000/mes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Tasa de Ahorro</p>
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl mb-1">{tasaAhorro}%</p>
            <p className="text-xs text-purple-600">Objetivo: 20%</p>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vista General</TabsTrigger>
            <TabsTrigger value="categories">Por Categorías</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart - Gastos por Categoría */}
              <Card className="p-6">
                <h3 className="mb-4">Distribución de Gastos</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Bar Chart - Gastos Semanales */}
              <Card className="p-6">
                <h3 className="mb-4">Gastos Esta Semana</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklySpending}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="amount" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Line Chart - Tendencia Mensual */}
            <Card className="p-6">
              <h3 className="mb-4">Ingresos vs Gastos (Últimos 6 meses)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryData.map((category) => {
                const Icon = category.icon;
                const percentage = (category.value / totalGastos * 100).toFixed(1);
                return (
                  <Card key={category.name} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                          <Icon className="h-5 w-5" style={{ color: category.color }} />
                        </div>
                        <div>
                          <h4 className="text-sm">{category.name}</h4>
                          <p className="text-xs text-gray-500">{percentage}% del total</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl mb-2">${category.value.toLocaleString()}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Top Transacciones por Categoría */}
            <Card className="p-6">
              <h3 className="mb-4">Transacciones Destacadas</h3>
              <div className="space-y-4">
                {[
                  { category: "Compras", merchant: "Amazon", amount: 245.50, date: "08 Nov" },
                  { category: "Vivienda", merchant: "Alquiler", amount: 1500.00, date: "01 Nov" },
                  { category: "Alimentos", merchant: "Supermercado", amount: 156.30, date: "05 Nov" },
                  { category: "Transporte", merchant: "Gasolina", amount: 85.00, date: "03 Nov" }
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="text-sm">{transaction.merchant}</p>
                      <p className="text-xs text-gray-500">{transaction.category} • {transaction.date}</p>
                    </div>
                    <p className="text-sm">-${transaction.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="mb-4">Tendencia de Ahorro</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend.map(m => ({ ...m, ahorro: m.ingresos - m.gastos }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="ahorro" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Proyección de Fin de Año</h3>
                <div className="space-y-4 mt-8">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Ingresos proyectados</span>
                    <span className="text-xl text-green-600">$60,000</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-600">Gastos proyectados</span>
                    <span className="text-xl text-red-600">$50,400</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Ahorro proyectado</span>
                    <span className="text-xl text-blue-600">$9,600</span>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Sugerencias para mejorar:</p>
                    <ul className="text-sm space-y-1">
                      <li>• Reduce gastos en compras un 15%</li>
                      <li>• Aumenta tu tasa de ahorro al 20%</li>
                      <li>• Considera inversiones de bajo riesgo</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Comparación Mes a Mes */}
            <Card className="p-6">
              <h3 className="mb-4">Comparación Mensual Detallada</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="ingresos" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="gastos" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
