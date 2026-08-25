import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PrivateRoute } from "@/components/PrivateRoute";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { NavigationLoader } from "./components/NavigationLoader";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminPromotions from "./pages/AdminPromotions";
import AdminReviews from "./pages/AdminReviews";
import AdminSettings from "./pages/AdminSettings";
import AdminMessages from "./pages/AdminMessages";
import AdminMedia from "./pages/AdminMedia";
import { AdminWorkspace, workspacePresets } from "./pages/AdminWorkspace";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/orders">
        {() => (
          <PrivateRoute requiredRole="user">
            <Orders />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/legal/:section" component={Legal} />
      <Route path="/product/:id" component={ProductDetail} />
      
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
      
      <Route path="/admin/media">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminMedia />
          </PrivateRoute>
        )}
      </Route>

      <Route path="/admin/messages">
        {() => (
          <PrivateRoute requiredRole="admin">
            <AdminMessages />
          </PrivateRoute>
        )}
      </Route>

      <Route path="/admin/collections">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.collections} /></PrivateRoute>}
      </Route>
      <Route path="/admin/translations">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.translations} /></PrivateRoute>}
      </Route>
      <Route path="/admin/suppliers">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.suppliers} /></PrivateRoute>}
      </Route>
      <Route path="/admin/suppliers/import">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.supplierImport} /></PrivateRoute>}
      </Route>
      <Route path="/admin/content">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.content} /></PrivateRoute>}
      </Route>
      <Route path="/admin/seo">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.seo} /></PrivateRoute>}
      </Route>
      <Route path="/admin/legal">
        {() => <PrivateRoute requiredRole="admin"><AdminWorkspace {...workspacePresets.legal} /></PrivateRoute>}
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
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <NavigationLoader />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
