import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function AdminOrders() {
  const orders = [
    { id: 1, orderNumber: "ORD-001", customer: "Jean Dupont", amount: "€125.50", date: "2024-01-08", status: "Livré" },
    { id: 2, orderNumber: "ORD-002", customer: "Marie Martin", amount: "€89.99", date: "2024-01-07", status: "En cours" },
    { id: 3, orderNumber: "ORD-003", customer: "Pierre Bernard", amount: "€234.00", date: "2024-01-06", status: "Traitement" },
    { id: 4, orderNumber: "ORD-004", customer: "Sophie Durand", amount: "€156.75", date: "2024-01-05", status: "Livré" },
    { id: 5, orderNumber: "ORD-005", customer: "Luc Moreau", amount: "€312.50", date: "2024-01-04", status: "En cours" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2">Suivez et gérez toutes les commandes</p>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Commande</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Livré" ? "bg-green-100 text-green-800" :
                        order.status === "En cours" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye size={16} />
                      </button>
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
