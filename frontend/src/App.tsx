import React, { useState } from 'react';
import { Navbar, type NavigationOptions } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ProductCatalog } from './components/marketplace/ProductCatalog';
import { BidsPortal, type BidsPortalTab } from './components/bids/BidsPortal';
import { GeMServicesPortal } from './components/services/GeMServicesPortal';
import { GeMMyChatModal } from './components/ai/GeMMyChatModal';
import { GeMPrototypeView } from './components/prototype/GeMPrototypeView';
import { GeMRegistrationPortal } from './components/auth/GeMRegistrationPortal';
import { GeMTrainingPortal } from './components/training/GeMTrainingPortal';
import { FloatingGeMMyButton } from './components/common/FloatingGeMMyButton';
import type { UserRole } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing-page');
  const [userRole, setUserRole] = useState<UserRole>('seller');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sub-view and tab management to avoid redundant collisions
  const [bidsTab, setBidsTab] = useState<BidsPortalTab>('ongoing');
  const [sellerTab, setSellerTab] = useState<string>('dashboard-view');
  const [registrationRole, setRegistrationRole] = useState<'seller' | 'buyer'>('seller');
  const [initialGemmyQuestion, setInitialGemmyQuestion] = useState<string>('');
  const [autoSendGemmy, setAutoSendGemmy] = useState<boolean>(false);

  React.useEffect(() => {
    const handleOpenGeMMy = (e: any) => {
      const q = e.detail?.question || '';
      const autoSend = e.detail?.autoSend ?? true;
      setInitialGemmyQuestion(q);
      setAutoSendGemmy(autoSend);
      setIsChatOpen(true);
    };
    window.addEventListener('open-gemmy-ai', handleOpenGeMMy);
    return () => window.removeEventListener('open-gemmy-ai', handleOpenGeMMy);
  }, []);

  const handleNavigate = (page: string, options?: NavigationOptions) => {
    if (options?.bidsTab) {
      setBidsTab(options.bidsTab);
    }
    if (options?.sellerTab) {
      setSellerTab(options.sellerTab);
    }
    if (options?.registrationRole) {
      setRegistrationRole(options.registrationRole);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromAI = (page: string, contextId?: string) => {
    if (page === 'seller-page' && (contextId === 'upload-view' || contextId === 'ocr')) {
      setSellerTab('upload-view');
    }
    setActivePage(page);
    if (page === 'officer-dash-page' || page === 'officer-page' || page === 'risk-page' || page === 'officer-compare-page') {
      setUserRole('officer');
    } else if (page === 'seller-page') {
      setUserRole('seller');
    } else if (page === 'audit-page') {
      setUserRole('auditor');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Whether current view is one of the specialized workflow modules
  const isWorkflowModule = [
    'login-page',
    'seller-page',
    'officer-dash-page',
    'officer-compare-page',
    'officer-page',
    'risk-page',
    'audit-page',
  ].includes(activePage);

  return (
    <div className="bg-[#f4f6f9] font-sans antialiased text-gray-800 min-h-screen flex flex-col">
      {/* Master Official GeM Header with Full Navigation across ALL views */}
      <Navbar
        activePage={activePage}
        setActivePage={handleNavigate}
        userRole={userRole}
        setUserRole={(newRole) => {
          setUserRole(newRole);
          if (newRole === 'seller') {
            setSellerTab('dashboard-view');
            setActivePage('seller-page');
          } else if (newRole === 'officer') {
            setActivePage('officer-dash-page');
          } else if (newRole === 'auditor') {
            setActivePage('audit-page');
          }
        }}
        onOpenChat={() => setIsChatOpen(true)}
        onSearchProduct={(q, cat) => {
          setSearchQuery(q);
          if (cat === 'Services') {
            setActivePage('services-page');
          } else {
            if (cat) setSelectedCategory(cat);
            setActivePage('products-page');
          }
        }}
      />

      {/* Main Routed Content */}
      <main className="flex-1 flex flex-col">
        {isWorkflowModule ? (
          <GeMPrototypeView
            initialPage={activePage}
            initialSellerTab={sellerTab}
            onOpenChat={() => setIsChatOpen(true)}
            onGoHome={() => {
              setActivePage('landing-page');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigate={(targetPage) => {
              setActivePage(targetPage);
            }}
          />
        ) : (
          <>
            {activePage === 'landing-page' && (
              <LandingPage
                onEnterSeller={() => {
                  setUserRole('seller');
                  setSellerTab('dashboard-view');
                  setActivePage('seller-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onEnterOfficer={() => {
                  setUserRole('officer');
                  setActivePage('officer-dash-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onEnterAudit={() => {
                  setUserRole('auditor');
                  setActivePage('audit-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onEnterRisk={() => {
                  setUserRole('officer');
                  setActivePage('risk-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenProducts={(category) => {
                  if (category) setSelectedCategory(category);
                  setActivePage('products-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenBids={(tab) => {
                  if (tab) setBidsTab(tab as BidsPortalTab);
                  setActivePage('bids-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenServices={() => {
                  setActivePage('services-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenTraining={() => {
                  setActivePage('training-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}

            {activePage === 'registration-page' && (
              <GeMRegistrationPortal
                initialRole={registrationRole}
                onCompleteSellerRegistration={() => {
                  setUserRole('seller');
                  setSellerTab('dashboard-view');
                  setActivePage('seller-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCompleteBuyerRegistration={() => {
                  setUserRole('officer');
                  setActivePage('officer-dash-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoBack={() => {
                  setActivePage('landing-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'services-page' && (
              <GeMServicesPortal
                initialQuery={searchQuery}
                onClose={() => {
                  setActivePage('landing-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectServiceForBids={(serviceName) => {
                  setBidsTab('ongoing');
                  setActivePage('bids-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onRunComplianceCheck={(service) => {
                  setUserRole('seller');
                  setSellerTab('checklist-view');
                  setActivePage('seller-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'products-page' && (
              <ProductCatalog
                initialCategory={selectedCategory}
                initialQuery={searchQuery}
                onClose={() => {
                  setActivePage('landing-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenTenderScrutiny={() => {
                  setUserRole('officer');
                  setActivePage('officer-compare-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'bids-page' && (
              <BidsPortal
                initialTab={bidsTab}
                onOpenOfficerScrutiny={() => {
                  setUserRole('officer');
                  setActivePage('officer-compare-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenSellerBid={() => {
                  setUserRole('seller');
                  setSellerTab('checklist-view');
                  setActivePage('seller-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activePage === 'training-page' && (
              <GeMTrainingPortal
                onGoHome={() => {
                  setActivePage('landing-page');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigateToModule={(route) => {
                  setActivePage(route);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Ask GeMMy Button (Across Landing Page, Seller & Buyer Desks) */}
      {!isChatOpen && (
        <FloatingGeMMyButton onClick={() => setIsChatOpen(true)} />
      )}

      {/* Global AI Statutory Compliance Modal Assistant - Available Everywhere */}
      <GeMMyChatModal
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setInitialGemmyQuestion('');
          setAutoSendGemmy(false);
        }}
        onNavigate={handleNavigateFromAI}
        initialQuestion={initialGemmyQuestion}
        autoSendInitial={autoSendGemmy}
        onClearInitial={() => {
          setInitialGemmyQuestion('');
          setAutoSendGemmy(false);
        }}
      />
    </div>
  );
}