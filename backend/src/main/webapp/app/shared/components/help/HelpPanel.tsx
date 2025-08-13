import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHelp, HelpItem } from './HelpProvider';
import { Button } from '../../design-system/components/Button/Button';
import { Input } from '../../design-system/components/Input/Input';
import { Modal } from '../../design-system/components/Modal/Modal';
import './HelpPanel.scss';

interface HelpCategoryProps {
  category: string;
  items: HelpItem[];
  onItemSelect: (item: HelpItem) => void;
}

const HelpCategory: React.FC<HelpCategoryProps> = ({ category, items, onItemSelect }) => {
  const { t } = useTranslation('help');
  const [isExpanded, setIsExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <div className="help-category">
      <button className="help-category__header" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <span className="help-category__title">{t(`categories.${category}`)}</span>
        <span className={`help-category__icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="help-category__items">
          {items.map(item => (
            <button key={item.id} className="help-item" onClick={() => onItemSelect(item)}>
              <div className="help-item__title">{item.title}</div>
              <div className="help-item__tags">
                {item.tags.map(tag => (
                  <span key={tag} className="help-item__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface HelpContentProps {
  item: HelpItem;
  onBack: () => void;
}

const HelpContent: React.FC<HelpContentProps> = ({ item, onBack }) => {
  const { t } = useTranslation('help');

  return (
    <div className="help-content">
      <div className="help-content__header">
        <Button variant="ghost" size="sm" onClick={onBack} className="help-content__back">
          ← {t('common.back')}
        </Button>
      </div>

      <div className="help-content__body">
        <h2 className="help-content__title">{item.title}</h2>

        <div className="help-content__meta">
          <span className="help-content__category">{t(`categories.${item.category}`)}</span>
          {item.component && <span className="help-content__component">{item.component}</span>}
        </div>

        <div className="help-content__text" dangerouslySetInnerHTML={{ __html: item.content }} />

        {item.tags.length > 0 && (
          <div className="help-content__tags">
            <span className="help-content__tags-label">{t('common.tags')}:</span>
            {item.tags.map(tag => (
              <span key={tag} className="help-content__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {item.url && (
          <div className="help-content__link">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="help-content__external-link">
              {t('common.learnMore')} ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export const HelpPanel: React.FC = () => {
  const { t } = useTranslation('help');
  const { isHelpPanelOpen, closeHelpPanel, helpItems, searchHelp, getHelpByCategory } = useHelp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);

  const filteredItems = useMemo(() => {
    if (searchQuery.trim()) {
      return searchHelp(searchQuery);
    }
    return helpItems;
  }, [searchQuery, searchHelp, helpItems]);

  const categorizedItems = useMemo(() => {
    const categories: Record<string, HelpItem[]> = {};

    filteredItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push(item);
    });

    return categories;
  }, [filteredItems]);

  const handleItemSelect = (item: HelpItem) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  const handleClose = () => {
    setSelectedItem(null);
    setSearchQuery('');
    closeHelpPanel();
  };

  return (
    <Modal isOpen={isHelpPanelOpen} onClose={handleClose} size="lg" className="help-panel-modal">
      <div className="help-panel">
        <h2>{t('panel.title')}</h2>
        {selectedItem ? (
          <HelpContent item={selectedItem} onBack={handleBack} />
        ) : (
          <>
            <div className="help-panel__search">
              <Input
                type="text"
                placeholder={t('panel.searchPlaceholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="help-panel__search-input"
              />
            </div>

            <div className="help-panel__content">
              {searchQuery.trim() && filteredItems.length === 0 ? (
                <div className="help-panel__no-results">
                  <p>{t('panel.noResults')}</p>
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                    {t('panel.clearSearch')}
                  </Button>
                </div>
              ) : (
                <div className="help-panel__categories">
                  {Object.entries(categorizedItems).map(([category, items]) => (
                    <HelpCategory key={category} category={category} items={items} onItemSelect={handleItemSelect} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

// Quick help button component
interface QuickHelpButtonProps {
  className?: string;
}

export const QuickHelpButton: React.FC<QuickHelpButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation('help');
  const { toggleHelpPanel } = useHelp();

  return (
    <Button variant="ghost" size="sm" onClick={toggleHelpPanel} className={`quick-help-button ${className}`}>
      <span className="quick-help-button__icon">?</span>
      <span className="quick-help-button__text">{t('panel.help')}</span>
    </Button>
  );
};
