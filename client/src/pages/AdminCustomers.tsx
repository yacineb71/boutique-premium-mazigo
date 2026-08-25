import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminCustomers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-[#eadfd4] bg-gradient-to-br from-[#fffaf3] to-[#f4e9df] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b65f3f]">Relation client</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] text-[#211e1b]">Clients</h1>
          <p className="mt-3 max-w-2xl text-[#6d6259]">La liste affichera uniquement les comptes et commandes réellement enregistrés dans MAZIGHO.</p>
        </section>

        <Card className="rounded-[1.25rem] border-[#eadfd4] bg-[#fffdf9] p-8 sm:p-12">
          <div className="mx-auto flex max-w-lg flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4e9df] text-[#b65f3f]">
              <Users size={26} aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[#211e1b]">Aucun client réel enregistré</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d6259]">
              Les données de démonstration ont été retirées. Cette page sera alimentée lorsque des utilisateurs se connecteront ou qu’une commande payée sera enregistrée.
            </p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

