import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconButton } from '../Button/Button';
import { useKeyboardNavigation, useAriaAttributes } from '../../../hooks/useAccessibility';
import './Sidebar.scss';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: IconDefinition;
  href?: string;
  onClick?: () => void;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  className?: string;
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  collapsedWidth?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  collapsed = false,
  onToggleCollapse,
  className = '',
  logo,
  footer,
  width = 256,
  collapsedWidth = 64,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleToggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!collapsed);
    }
  };

  const sidebarClasses = ['satori-sidebar', collapsed && 'satori-sidebar--collapsed', className].filter(Boolean).join(' ');

  const sidebarStyle = {
    width: collapsed ? collapsedWidth : width,
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const showChildren = hasChildren && isExpanded && !collapsed;

    const itemClasses = [
      'satori-sidebar-item',
      `satori-sidebar-item--level-${level}`,
      item.active && 'satori-sidebar-item--active',
      item.disabled && 'satori-sidebar-item--disabled',
      hasChildren && 'satori-sidebar-item--has-children',
    ]
      .filter(Boolean)
      .join(' ');

    const handleItemClick = () => {
      if (item.disabled) return;

      if (hasChildren) {
        if (!collapsed) {
          toggleExpanded(item.id);
        }
      } else if (item.onClick) {
        item.onClick();
      }
    };

    // Enhanced keyboard navigation
    const { handleKeyDown: handleNativeKeyDown } = useKeyboardNavigation(
      handleItemClick, // Enter key
      undefined, // Escape key
      () => {
        // Arrow up - focus previous item
        const currentElement = document.activeElement as HTMLElement;
        const allItems = Array.from(document.querySelectorAll('.satori-sidebar-item__link, .satori-sidebar-item__button'));
        const currentIndex = allItems.indexOf(currentElement);
        if (currentIndex > 0) {
          (allItems[currentIndex - 1] as HTMLElement).focus();
        }
      },
      () => {
        // Arrow down - focus next item
        const currentElement = document.activeElement as HTMLElement;
        const allItems = Array.from(document.querySelectorAll('.satori-sidebar-item__link, .satori-sidebar-item__button'));
        const currentIndex = allItems.indexOf(currentElement);
        if (currentIndex < allItems.length - 1) {
          (allItems[currentIndex + 1] as HTMLElement).focus();
        }
      },
      hasChildren && !collapsed
        ? () => {
            // Arrow left - collapse if expanded
            if (isExpanded) {
              toggleExpanded(item.id);
            }
          }
        : undefined,
      hasChildren && !collapsed
        ? () => {
            // Arrow right - expand if collapsed
            if (!isExpanded) {
              toggleExpanded(item.id);
            }
          }
        : undefined,
    );

    // Wrapper to convert React.KeyboardEvent to native KeyboardEvent
    const handleKeyDown = (event: React.KeyboardEvent) => {
      handleNativeKeyDown(event.nativeEvent);
    };

    // ARIA attributes
    const ariaAttributes = useAriaAttributes(
      hasChildren ? 'treeitem' : 'menuitem',
      item.label,
      undefined,
      undefined,
      hasChildren ? isExpanded : undefined,
      item.active,
      item.disabled,
      undefined,
      undefined,
      item.active ? 'page' : undefined,
    );

    const commonProps = {
      className: hasChildren ? 'satori-sidebar-item__button' : 'satori-sidebar-item__link',
      onClick: handleItemClick,
      onKeyDown: handleKeyDown,
      title: collapsed ? item.label : undefined,
      tabIndex: item.disabled ? -1 : 0,
      ...ariaAttributes,
    };

    return (
      <div key={item.id} className="satori-sidebar-item-wrapper">
        <div className={itemClasses}>
          {item.href && !hasChildren ? (
            <a href={item.href} {...commonProps}>
              <SidebarItemContent item={item} collapsed={collapsed} hasChildren={hasChildren} isExpanded={isExpanded} />
            </a>
          ) : (
            <button {...commonProps} disabled={item.disabled} type="button">
              <SidebarItemContent item={item} collapsed={collapsed} hasChildren={hasChildren} isExpanded={isExpanded} />
            </button>
          )}
        </div>

        {showChildren && (
          <div className="satori-sidebar-submenu" role="group" aria-label={`${item.label} submenu`}>
            {item.children.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={sidebarClasses} style={sidebarStyle} role="navigation" aria-label="Main navigation" id="main-navigation">
      <div className="satori-sidebar__header">
        {logo && (
          <div className="satori-sidebar__logo" role="banner">
            {logo}
          </div>
        )}

        {onToggleCollapse && (
          <div className="satori-sidebar__toggle">
            <IconButton
              icon={collapsed ? faBars : faChevronLeft}
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
              aria-expanded={!collapsed}
              aria-controls="sidebar-menu"
            />
          </div>
        )}
      </div>

      <nav className="satori-sidebar__nav" role="navigation" aria-label="Primary navigation">
        <div className="satori-sidebar__menu" role="tree" id="sidebar-menu" aria-label="Navigation menu">
          {items.map(item => renderSidebarItem(item))}
        </div>
      </nav>

      {footer && (
        <div className="satori-sidebar__footer" role="contentinfo">
          {footer}
        </div>
      )}
    </aside>
  );
};

interface SidebarItemContentProps {
  item: SidebarItem;
  collapsed: boolean;
  hasChildren: boolean;
  isExpanded: boolean;
}

const SidebarItemContent: React.FC<SidebarItemContentProps> = ({ item, collapsed, hasChildren, isExpanded }) => {
  return (
    <>
      {item.icon && (
        <div className="satori-sidebar-item__icon">
          <FontAwesomeIcon icon={item.icon} />
        </div>
      )}

      {!collapsed && (
        <>
          <span className="satori-sidebar-item__label">{item.label}</span>

          {item.badge && <span className="satori-sidebar-item__badge">{item.badge}</span>}

          {hasChildren && (
            <div className="satori-sidebar-item__chevron">
              <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
            </div>
          )}
        </>
      )}
    </>
  );
};
