import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

interface ProductReviewProps {
  productId: number;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onAddReview?: (review: Omit<Review, "id" | "date">) => void;
}

export function ProductReview({
  productId,
  reviews,
  averageRating,
  totalReviews,
  onAddReview,
}: ProductReviewProps) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      onAddReview({
        author,
        rating,
        title,
        comment,
        verified: false,
      });
    }
    setRating(5);
    setTitle("");
    setComment("");
    setAuthor("");
    setShowForm(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Avis Clients</h3>
        <div className="flex items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              <div>
                {renderStars(Math.round(averageRating))}
                <p className="text-sm text-gray-600 mt-1">{totalReviews} avis</p>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="w-full">
          {showForm ? "Annuler" : "Laisser un Avis"}
        </Button>
      </Card>

      {/* Review Form */}
      {showForm && (
        <Card className="p-6 bg-gray-50">
          <h4 className="font-bold text-gray-900 mb-4">Votre Avis</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Titre de votre avis"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Commentaire</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Votre commentaire..."
              />
            </div>

            <Button type="submit" className="w-full">
              Publier l'Avis
            </Button>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-gray-900">{review.title}</h4>
                <p className="text-sm text-gray-600">
                  par {review.author} • {review.date}
                </p>
              </div>
              {review.verified && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  ✓ Achat Vérifié
                </span>
              )}
            </div>
            <div className="mb-3">{renderStars(review.rating)}</div>
            <p className="text-gray-700">{review.comment}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
