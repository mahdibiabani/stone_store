import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AboutSection from './components/AboutSection';
import AllProducts from './components/AllProducts';
import AllProjects from './components/AllProjects';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import Login from './components/Login';
import ProductDetail from './components/ProductDetail';
import ProductsSection from './components/ProductsSection';
import Profile from './components/Profile';
import ProjectDetail from './components/ProjectDetail';
import ProjectsSection from './components/ProjectsSection';
import QuoteSection from './components/QuoteSection';
import { useAuth } from './contexts/AuthContext';
import { useStone, useProject, useStones, useProjects, Project } from './hooks/useData';
import './index.css';
import { Stone } from './types';


// Home Page Component
function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewProduct = (stone: Stone) => {
    navigate(`/product/${stone.id}`);
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleViewAllProjects = () => {
    navigate('/projects');
  };

  const handleViewProject = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onCartClick={handleCartClick}
        onProfileClick={handleProfileClick}
        onLoginClick={handleLoginClick}
        onHomeClick={handleHomeClick}
      />
      <div id="hero">
        <Hero />
      </div>
      <div id="products">
        <ProductsSection onViewProduct={handleViewProduct} onViewAllProducts={handleViewAllProducts} onLoginClick={handleLoginClick} />
      </div>
      <div id="projects">
        <ProjectsSection onViewAllProjects={handleViewAllProjects} onViewProject={handleViewProject} />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="contact">
        <QuoteSection />
      </div>
      <Footer />
    </div>
  );
}

// Product Detail Page Component
function ProductDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get product ID from URL
  const productId = location.pathname.split('/')[2];
  const { stone, loading } = useStone(productId);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!stone) {
    return <div className="flex items-center justify-center min-h-screen">Product not found</div>;
  }

  return (
    <ProductDetail
      stone={stone}
      onBack={handleBack}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onHomeClick={handleHomeClick}
    />
  );
}

// Project Detail Page Component
function ProjectDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get project ID from URL
  const projectId = location.pathname.split('/')[2];
  const { project, loading } = useProject(projectId);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="flex items-center justify-center min-h-screen">Project not found</div>;
  }

  return (
    <ProjectDetail
      project={project}
      onBack={handleBack}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onHomeClick={handleHomeClick}
    />
  );
}

// All Products Page Component
function AllProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stones } = useStones();

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewProduct = (stone: Stone) => {
    navigate(`/product/${stone.id}`);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AllProducts
      stones={stones}
      onBack={handleBack}
      onViewProduct={handleViewProduct}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onHomeClick={handleHomeClick}
    />
  );
}

// All Projects Page Component
function AllProjectsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { projects } = useProjects();

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewProject = (project: Project) => {
    navigate(`/project/${project.id}`);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AllProjects
      projects={projects}
      onBack={handleBack}
      onViewProject={handleViewProject}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onHomeClick={handleHomeClick}
    />
  );
}

// Cart Page Component
function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Cart
      onBack={handleBack}
      onContinueShopping={handleContinueShopping}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onHomeClick={handleHomeClick}
    />
  );
}

// Login Page Component
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate('/');
  };

  const handleSuccess = () => {
    // Always go to home page after successful login
    navigate('/');
  };

  return <Login onClose={handleClose} onSuccess={handleSuccess} />;
}

// Profile Page Component
function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Profile
      onBack={handleBack}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onHomeClick={handleHomeClick}
    />
  );
}

// Payment Success Page Component
function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get URL parameters
  const urlParams = new URLSearchParams(location.search);
  const success = urlParams.get('success') === 'true';
  const orderNumber = urlParams.get('order_number');
  const refId = urlParams.get('ref_id');
  
  // If user is not logged in, redirect to home
  // This prevents accessing payment success page when not authenticated
  if (!user) {
    navigate('/');
    return null;
  }
  
  const handleViewOrders = () => {
    navigate('/profile');
  };
  
  const handleBackHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {success ? (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              پرداخت موفقیت‌آمیز!
            </h1>
            <p className="text-gray-600 mb-6">
              سفارش شما با موفقیت ثبت شد
            </p>
            {orderNumber && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">شماره سفارش:</p>
                <p className="font-bold">{orderNumber}</p>
                {refId && (
                  <>
                    <p className="text-sm text-gray-600 mt-2">شماره پیگیری:</p>
                    <p className="font-bold">{refId}</p>
                  </>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleViewOrders}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                مشاهده سفارشات
              </button>
              <button
                onClick={handleBackHome}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                بازگشت به خانه
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              پرداخت ناموفق
            </h1>
            <p className="text-gray-600 mb-6">
              پرداخت انجام نشد. لطفاً دوباره تلاش کنید
            </p>
            {orderNumber && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">شماره سفارش:</p>
                <p className="font-bold">{orderNumber}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/cart')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                بازگشت به سبد خرید
              </button>
              <button
                onClick={handleBackHome}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                بازگشت به خانه
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;