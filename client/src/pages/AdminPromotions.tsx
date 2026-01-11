import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminPromotions() {
  const promotions = [
    { id: 1, code: "PROMO10", discount: "10%", type: "Pourcentage", active: true, uses: 45, limit: 100 },
    { id: 2, code: "WELCOME20", discount: "€20", type: "Montant Fixe", active: true, uses: 12, limit: 50 },
    { id: 3, code: "SUMMER15", discount: "15%", type: "Pourcentage", active: false, uses: 89, limit: 100 },
    { id: 4, code: "VIPCODE", discount: "€50", type: "Montant Fixe", active: true, uses: 8, limit: 20 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Promotions</h1>
            <p className="text-gray-600 mt-2">Créez et gérez vos codes promo</p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Ajouter une Promotion
          </Button>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Code</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Réduction</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilisations</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{promo.code}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">{promo.discount}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{promo.type}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promo.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {promo.active ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{promo.uses}/{promo.limit}</td>
                    <td className="py-3 px-4 text-sm flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
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
