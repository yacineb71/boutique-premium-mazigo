import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { MessageSquareText } from "lucide-react";

export default function AdminReviews() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modération des avis</h1>
          <p className="mt-2 text-gray-600">Les avis authentifiés apparaîtront ici pour être modérés.</p>
        </div>

        <Card className="p-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <MessageSquareText className="h-10 w-10 text-[#b65f3f]" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-gray-900">Aucun avis à modérer</h2>
            <p className="max-w-lg text-sm leading-6 text-gray-600">
              Les avis clients ne sont pas préremplis. Lorsqu’un avis réel sera soumis et enregistré, il sera listé ici avec ses informations de modération.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
