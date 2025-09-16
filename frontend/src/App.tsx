import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductsSection from './components/ProductsSection';
import ProjectsSection from './components/ProjectsSection';
import AboutSection from './components/AboutSection';
import QuoteSection from './components/QuoteSection';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import { Stone } from './types';
import './index.css';

type ViewType = 'home' | 'product' | 'cart';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProduct, setSelectedProduct] = useState<Stone | null>(null);

  const handleViewProduct = (stone: Stone) => {
    setSelectedProduct(stone);
    setCurrentView('product');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
  };

  const handleCartClick = () => {
    setCurrentView('cart');
  };

  if (currentView === 'product' && selectedProduct) {
    return <ProductDetail stone={selectedProduct} onBack={handleBackToHome} />;
  }

  if (currentView === 'cart') {
    return <Cart onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header onCartClick={handleCartClick} />
      <div id="hero">
        <Hero />
      </div>
      <div id="products">
        <ProductsSection onViewProduct={handleViewProduct} />
      </div>
      <div id="projects">
        <ProjectsSection />
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