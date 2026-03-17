import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivateRoute } from "@/components/PrivateRoute";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminPromotions from "./pages/AdminPromotions";
import AdminReviews from "./pages/AdminReviews";
import AdminSettings from "./pages/AdminSettings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/cart" component={Cart} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/products">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminProducts />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/categories">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminCategories />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/orders">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminOrders />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/customers">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminCustomers />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/promotions">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminPromotions />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/reviews">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminReviews />
          </PrivateRoute>
        )}
      </Route>
      
      <Route path="/admin/settings">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminSettings />
          </PrivateRoute>
        )}
      </Route>

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

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
