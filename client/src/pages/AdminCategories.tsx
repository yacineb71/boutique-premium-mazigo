import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const categories = [
    { id: 1, name: "Vêtements", products: 120, status: "Actif" },
    { id: 2, name: "Cosmétiques", products: 95, status: "Actif" },
    { id: 3, name: "Accessoires", products: 85, status: "Actif" },
    { id: 4, name: "Cadeaux", products: 70, status: "Actif" },
    { id: 5, name: "Jouets", products: 60, status: "Actif" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
            <p className="text-gray-600 mt-2">Organisez vos catégories de produits</p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Ajouter une Catégorie
          </Button>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Produits</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{cat.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{cat.products}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {cat.status}
                      </span>
                    </td>
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
