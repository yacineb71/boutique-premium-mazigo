import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Check, X, Star } from "lucide-react";

export default function AdminReviews() {
  const reviews = [
    { id: 1, product: "T-Shirt Bleu", author: "Jean D.", rating: 5, comment: "Excellent produit, très satisfait!", status: "Approuvé" },
    { id: 2, product: "Crème Hydratante", author: "Marie M.", rating: 4, comment: "Bon produit, livraison rapide", status: "Approuvé" },
    { id: 3, product: "Sac à Main", author: "Pierre B.", rating: 3, comment: "Correct mais un peu cher", status: "En attente" },
    { id: 4, product: "Montre Élégante", author: "Sophie D.", rating: 5, comment: "Magnifique, dépassé mes attentes!", status: "En attente" },
    { id: 5, product: "Parfum Premium", author: "Luc M.", rating: 2, comment: "Odeur trop forte pour moi", status: "Rejeté" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modération des Avis</h1>
          <p className="text-gray-600 mt-2">Approuvez ou rejetez les avis clients</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.product}</h3>
                    <p className="text-sm text-gray-600">par {review.author}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    review.status === "Approuvé" ? "bg-green-100 text-green-800" :
                    review.status === "En attente" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {review.status}
                  </span>
                </div>
                
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4">{review.comment}</p>
                
                {review.status === "En attente" && (
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition">
                      <Check size={16} />
                      Approuver
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition">
                      <X size={16} />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
