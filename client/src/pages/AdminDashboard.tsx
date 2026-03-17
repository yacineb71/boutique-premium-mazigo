import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { BarChart3, Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { trpc } from "@/lib/trpc";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AdminDashboard() {
  // Récupérer les produits via tRPC
  const { data: products = [] } = trpc.products.getAll.useQuery();

  const stats = [
    { label: "Commandes totales", value: "1,234", icon: ShoppingCart, color: "bg-blue-500" },
    { label: "Produits", value: products.length.toString(), icon: Package, color: "bg-green-500" },
    { label: "Clients", value: "789", icon: Users, color: "bg-purple-500" },
    { label: "Revenus", value: "€45,678", icon: TrendingUp, color: "bg-orange-500" },
  ];

  const recentOrders = [
    { id: 1, orderNumber: "ORD-001", customer: "Jean Dupont", amount: "€125.50", status: "Livré" },
    { id: 2, orderNumber: "ORD-002", customer: "Marie Martin", amount: "€89.99", status: "En cours" },
    { id: 3, orderNumber: "ORD-003", customer: "Pierre Bernard", amount: "€234.00", status: "Traitement" },
  ];

  const revenueChartData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    datasets: [
      {
        label: "Revenus (€)",
        data: [3200, 4100, 3800, 5200, 4900, 6100, 5800, 7200, 6900, 8100, 7800, 9200],
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#0ea5e9",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const ordersChartData = {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Commandes",
        data: [12, 19, 15, 25, 22, 30, 28],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
          "#ec4899",
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const productsChartData = {
    labels: ["Vêtements", "Cosmétiques", "Accessoires", "Cadeaux", "Jouets"],
    datasets: [
      {
        data: [120, 95, 85, 70, 60],
        backgroundColor: [
          "#3b82f6",
          "#ec4899",
          "#f59e0b",
          "#10b981",
          "#8b5cf6",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          font: { size: 12, weight: 500 as any },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          font: { size: 12, weight: 500 as any },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenus Mensuels</h3>
            <Line data={revenueChartData} options={chartOptions} height={300} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Commandes par Jour</h3>
            <Bar data={ordersChartData} options={chartOptions} height={300} />
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribution des Produits</h3>
          <Doughnut data={productsChartData} options={donutOptions} height={300} />
        </Card>

        {/* Recent Orders */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Commandes Récentes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Numéro</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{order.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-semibold">{order.amount}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Livré" ? "bg-green-100 text-green-800" :
                        order.status === "En cours" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
