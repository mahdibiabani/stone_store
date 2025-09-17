import { useState } from 'react';
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
import './index.css';
import { Stone } from './types';

type ViewType = 'home' | 'product' | 'cart' | 'allProducts' | 'allProjects' | 'project' | 'login' | 'profile';

interface Project {
  id: number;
  title: {
    en: string;
    fa: string;
  };
  description: {
    en: string;
    fa: string;
  };
  location: {
    en: string;
    fa: string;
  };
  year: string;
  category: {
    en: string;
    fa: string;
  };
  stones: string[];
  image: string;
  gallery?: string[];
  video?: string;
  client?: {
    en: string;
    fa: string;
  };
  size?: {
    en: string;
    fa: string;
  };
  duration?: {
    en: string;
    fa: string;
  };
  challenges?: {
    en: string;
    fa: string;
  };
  solutions?: {
    en: string;
    fa: string;
  };
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Stone | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [previousView, setPreviousView] = useState<ViewType>('home');
  const { user } = useAuth();

  const handleViewProduct = (stone: Stone) => {
    setPreviousView(currentView);
    setSelectedProduct(stone);
    setCurrentView('product');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    setPreviousView('home');
  };

  const handleBackToPrevious = () => {
    setCurrentView(previousView);
    setSelectedProduct(null);
    setSelectedProject(null);
  };

  const handleCartClick = () => {
    // Check if user is logged in before allowing cart access
    if (!user) {
      setPreviousView(currentView);
      setCurrentView('login');
      return;
    }
    setPreviousView(currentView);
    setCurrentView('cart');
  };

  const handleViewAllProducts = () => {
    setCurrentView('allProducts');
  };

  const handleViewAllProjects = () => {
    setCurrentView('allProjects');
  };

  const handleViewProject = (project: Project) => {
    setPreviousView(currentView);
    setSelectedProject(project);
    setCurrentView('project');
  };

  const handleLoginClick = () => {
    setPreviousView(currentView);
    setCurrentView('login');
  };

  const handleProfileClick = () => {
    setPreviousView(currentView);
    setCurrentView('profile');
  };

  const handleLoginSuccess = () => {
    setCurrentView(previousView);
  };

  if (currentView === 'product' && selectedProduct) {
    return <ProductDetail
      stone={selectedProduct}
      onBack={handleBackToPrevious}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
    />;
  }

  if (currentView === 'cart') {
    return <Cart
      onBack={handleBackToHome}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
    />;
  }

  if (currentView === 'allProducts') {
    return <AllProducts
      onBack={handleBackToHome}
      onViewProduct={handleViewProduct}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
    />;
  }

  if (currentView === 'allProjects') {
    return <AllProjects
      onBack={handleBackToHome}
      onViewProject={handleViewProject}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
    />;
  }

  if (currentView === 'project' && selectedProject) {
    return <ProjectDetail
      project={selectedProject}
      onBack={handleBackToPrevious}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
    />;
  }

  if (currentView === 'login') {
    return <Login onClose={handleBackToPrevious} onSuccess={handleLoginSuccess} />;
  }

  if (currentView === 'profile') {
    return <Profile
      onBack={handleBackToHome}
      onCartClick={handleCartClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
    />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onCartClick={handleCartClick}
        onProfileClick={handleProfileClick}
        onLoginClick={handleLoginClick}
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

export default App;