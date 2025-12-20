import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Lazy load pages for better performance
const Shop = lazy(() => import("./pages/Shop"));
const Category = lazy(() => import("./pages/Category"));
const Product = lazy(() => import("./pages/Product"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Nouveautes = lazy(() => import("./pages/Nouveautes"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const Promos = lazy(() => import("./pages/Promos"));
const Account = lazy(() => import("./pages/Account"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Orders = lazy(() => import("./pages/Orders"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const AllProducts = lazy(() => import("./pages/AllProducts"));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        <Route path={"\u002f"} component={Home} />
        <Route path={"/boutique"} component={Shop} />
        <Route path={"/categorie/:slug"} component={Category} />
        <Route path={"/produit/:slug"} component={Product} />
        <Route path={"/a-propos"} component={About} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/panier"} component={Cart} />
        <Route path={"/nouveautes"} component={Nouveautes} />
        <Route path={"/best-sellers"} component={BestSellers} />
        <Route path={"/promos"} component={Promos} />
        <Route path={"/mon-compte"} component={Account} />
        <Route path={"/favoris"} component={Favorites} />
        <Route path={"/commandes"} component={Orders} />
        <Route path={"/parametres"} component={SettingsPage} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/faq" component={FAQ} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/produits" component={AllProducts} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
