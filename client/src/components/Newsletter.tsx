import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler l'envoi à un service de newsletter
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Newsletter subscription:", email);
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Newsletter error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Restez Informé</h2>
          <p className="text-teal-100">
            Inscrivez-vous à notre newsletter pour recevoir les dernières offres et promotions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Votre email..."
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-white text-teal-600 hover:bg-gray-100"
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>

        {submitted && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
            ✅ Merci ! Vérifiez votre email pour confirmer votre inscription.
          </div>
        )}
      </div>
    </section>
  );
}
