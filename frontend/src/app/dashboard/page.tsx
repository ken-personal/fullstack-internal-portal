import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesChart from "@/components/charts/SalesChart";
import ExpensePieChart from "@/components/charts/ExpensePieChart";
import ProfitBarChart from "@/components/charts/ProfitBarChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

const kpis = [
  { title: "Total Sales",  value: "$12,000", trend: "+8.2%",  up: true },
  { title: "Expenses",     value: "$4,200",  trend: "+2.1%",  up: false },
  { title: "Profit",       value: "$7,800",  trend: "+12.4%", up: true },
  { title: "Employees",    value: "24",      trend: "+2",     up: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">

      {/* KPIカード */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.title}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                {k.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{k.value}</p>
              <p className={`mt-1 text-xs font-medium ${k.up ? "text-green-500" : "text-red-400"}`}>
                {k.up ? "▲" : "▼"} {k.trend} vs last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 売上推移 ＋ 経費内訳 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <ExpensePieChart />
      </div>

      {/* 月別利益 ＋ アクティビティ */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfitBarChart />
        </div>
        <ActivityFeed />
      </div>

    </div>
  );
}