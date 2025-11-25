import { Card } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  {
    name: "Ene",
    ingresos: 4000,
    gastos: 2400,
  },
  {
    name: "Feb",
    ingresos: 3000,
    gastos: 1398,
  },
  {
    name: "Mar",
    ingresos: 2000,
    gastos: 3800,
  },
  {
    name: "Abr",
    ingresos: 2780,
    gastos: 3908,
  },
  {
    name: "May",
    ingresos: 1890,
    gastos: 4800,
  },
  {
    name: "Jun",
    ingresos: 2390,
    gastos: 3800,
  },
  {
    name: "Jul",
    ingresos: 3490,
    gastos: 4300,
  },
];

export function SpendingChart() {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Ingresos vs Gastos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
  );
}
