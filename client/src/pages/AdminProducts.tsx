import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { useState } from "react";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { id: 1, name: "T-Shirt Bleu", category: "Vêtements", price: "€29.99", stock: 45, status: "Actif" },
    { id: 2, name: "Crème Hydratante", category: "Cosmétiques", price: "€49.99", stock: 12, status: "Actif" },
    { id: 3, name: "Sac à Main", category: "Accessoires", price: "€89.99", stock: 8, status: "Actif" },
    { id: 4, name: "Montre Élégante", category: "Accessoires", price: "€199.99", stock: 3, status: "Stock Faible" },
    { id: 5, name: "Parfum Premium", category: "Cosmétiques", price: "€79.99", stock: 0, status: "Rupture" },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-600 mt-2">Gérez votre catalogue de produits</p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Ajouter un Produit
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Produit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Catégorie</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prix</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">{product.price}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.stock} unités</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === "Actif" ? "bg-green-100 text-green-800" :
                        product.status === "Stock Faible" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {product.status}
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
