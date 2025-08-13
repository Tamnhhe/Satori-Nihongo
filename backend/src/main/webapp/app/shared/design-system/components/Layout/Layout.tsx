import React, { useState } from 'react';
import { Sidebar, SidebarItem } from './Sidebar';
import { Header, HeaderProps } from './Header';
import './Layout.scss';

export interface LayoutProps {
  children: React.ReactNode;
  sidebarItems?: SidebarItem[];
  headerProps?: Omit<HeaderProps, 'onMobileMenuToggle' | 'showMobileMenuToggle'>;
  showSidebar?: boolean;
  showHeader?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
  className?: string;
  sidebarLogo?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  fluid?: boolean;
  contentPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  sidebarItems = [],
  headerProps,
  showSidebar = true,
  showHeader = true,
  sidebarCollapsed = false,
  onSidebarToggle,
  className = '',
  sidebarLogo,
  sidebarFooter,
  fluid = false,
  contentPadding = 'md',
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [internalSidebarCollapsed, setInternalSidebarCollapsed] = useState(sidebarCollapsed);

  const handleSidebarToggle = (collapsed: boolean) => {
    setInternalSidebarCollapsed(collapsed);
    if (onSidebarToggle) {
      onSidebarToggle(collapsed);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const layoutClasses = [
    'satori-layout',
    showSidebar && 'satori-layout--with-sidebar',
    showHeader && 'satori-layout--with-header',
    internalSidebarCollapsed && 'satori-layout--sidebar-collapsed',
    isMobileSidebarOpen && 'satori-layout--mobile-sidebar-open',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    'satori-layout__content',
    `satori-layout__content--padding-${contentPadding}`,
    !fluid && 'satori-layout__content--container',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClasses}>
      {/* Skip links for accessibility */}
      <div className="skip-links" aria-label="Skip navigation links">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {showSidebar && (
          <a href="#main-navigation" className="skip-link">
            Skip to navigation
          </a>
        )}
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="satori-layout__mobile-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className={`satori-layout__sidebar ${isMobileSidebarOpen ? 'satori-layout__sidebar--mobile-open' : ''}`}>
          <Sidebar
            items={sidebarItems}
            collapsed={internalSidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
            logo={sidebarLogo}
            footer={sidebarFooter}
          />
        </div>
      )}

      {/* Main content area */}
      <div className="satori-layout__main">
        {/* Header */}
        {showHeader && <Header {...headerProps} onMobileMenuToggle={handleMobileMenuToggle} showMobileMenuToggle={showSidebar} />}

        {/* Content */}
        <main className={contentClasses} id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions, className = '' }) => {
  const headerClasses = ['satori-page-header', className].filter(Boolean).join(' ');

  return (
    <header className={headerClasses} role="banner">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="satori-page-header__breadcrumbs" aria-label="Breadcrumb navigation">
          <ol className="satori-page-header__breadcrumb-list" role="list">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="satori-page-header__breadcrumb-item" role="listitem">
                {index > 0 && (
                  <span className="satori-page-header__breadcrumb-separator" aria-hidden="true">
                    /
                  </span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="satori-page-header__breadcrumb-link"
                    aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                  >
                    {crumb.label}
                  </a>
                ) : crumb.onClick ? (
                  <button
                    onClick={crumb.onClick}
                    className="satori-page-header__breadcrumb-button"
                    type="button"
                    aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="satori-page-header__breadcrumb-current" aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="satori-page-header__content">
        <div className="satori-page-header__text">
          <h1 className="satori-page-header__title heading-level-1">{title}</h1>
          {subtitle && <p className="satori-page-header__subtitle">{subtitle}</p>}
        </div>

        {actions && (
          <div className="satori-page-header__actions" role="toolbar" aria-label="Page actions">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
