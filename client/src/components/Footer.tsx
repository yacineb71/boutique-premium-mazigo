import { Link } from "wouter";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Newsletter />
      <footer className="bg-gray-900 text-gray-300 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">À Propos</h3>
            <p className="text-sm text-gray-400">
              MAZIGHO est votre boutique premium pour les vêtements, cosmétiques, accessoires, cadeaux et jouets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4">Service Client</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@mazigho.com" className="text-gray-400 hover:text-white transition">
                  contact@mazigho.com
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="text-gray-400 hover:text-white transition">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="text-gray-400">
                Lun-Ven: 9h-18h
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-bold mb-4">Nous Suivre</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {currentYear} MAZIGHO. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Politique de Confidentialité
              </a>
              <a href="#" className="hover:text-white transition">
                Conditions d'Utilisation
              </a>
              <a href="#" className="hover:text-white transition">
                Mentions Légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
