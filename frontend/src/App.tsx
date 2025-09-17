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
import { useStone, useProject, getAllStones, getAllProjects, Project } from './hooks/useData';
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
  const stones = getAllStones();

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
  const projects = getAllProjects();

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

  const handleClose = () => {
    navigate(-1);
  };

  const handleSuccess = () => {
    navigate(-1);
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
      </Routes>
    </Router>
  );
}

export default App;