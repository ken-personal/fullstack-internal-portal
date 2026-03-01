import Card from "@/components/ui/Card";
import SalesChart from "@/components/charts/SalesChart";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Sales" value="$12,000" />
        <Card title="Expenses" value="$4,200" />
        <Card title="Profit" value="$7,800" />
        <Card title="Employees" value="24" />
      </div>

      <SalesChart />
    </div>
  );
}
