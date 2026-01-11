import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";

export default function AdminCustomers() {
  const customers = [
    { id: 1, name: "Jean Dupont", email: "jean@example.com", orders: 5, total: "€625.50", joinDate: "2023-12-01" },
    { id: 2, name: "Marie Martin", email: "marie@example.com", orders: 3, total: "€289.99", joinDate: "2023-12-15" },
    { id: 3, name: "Pierre Bernard", email: "pierre@example.com", orders: 8, total: "€1,234.00", joinDate: "2023-11-20" },
    { id: 4, name: "Sophie Durand", email: "sophie@example.com", orders: 2, total: "€156.75", joinDate: "2024-01-01" },
    { id: 5, name: "Luc Moreau", email: "luc@example.com", orders: 6, total: "€912.50", joinDate: "2023-10-15" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600 mt-2">Gérez votre base de clients</p>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Commandes</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Dépensé</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date d'Inscription</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.orders}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">{customer.total}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{customer.joinDate}</td>
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
