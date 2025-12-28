import { createContext, useContext } from 'react';

const TabsContext = createContext();

const Tabs = ({ children, activeTab, onTabChange, className = '' }) => {
  // Extract tab data from children
  const tabs = [];
  const tabContents = [];

  // Process children to separate tabs and content
  const processChildren = (children) => {
    const childArray = Array.isArray(children) ? children : [children];
    childArray.forEach((child) => {
      if (child?.type === Tab) {
        tabs.push({
          id: child.props.id,
          label: child.props.label,
          icon: child.props.icon,
        });
        tabContents.push({
          id: child.props.id,
          content: child.props.children,
        });
      }
    });
  };

  processChildren(children);

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange }}>
      <div className={className}>
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${
                      isActive
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {tabContents.map((tabContent) => (
            <div
              key={tabContent.id}
              className={activeTab === tabContent.id ? 'block' : 'hidden'}
            >
              {tabContent.content}
            </div>
          ))}
        </div>
      </div>
    </TabsContext.Provider>
  );
};

// Tab component for declarative API
const Tab = ({ children }) => {
  return children;
};

// Attach Tab as a static property
Tabs.Tab = Tab;

// Hook to use tabs context
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
};

export default Tabs;
