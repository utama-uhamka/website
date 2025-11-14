import { useState } from 'react';
import { FiZap, FiDroplet } from 'react-icons/fi';
import PLNBilling from './PLN/PLNBilling';
import PDAMBilling from './PDAM/PDAMBilling';

const BillingIndex = () => {
  const [activeTab, setActiveTab] = useState('pln');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Billing</h1>
        <p className="text-gray-500 mt-1">Kelola tagihan listrik (PLN) dan air (PDAM)</p>
      </div>

      {/* Tab Selection */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pln')}
            className={`flex items-center gap-3 flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'pln'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiZap size={20} />
            PLN (Listrik)
          </button>
          <button
            onClick={() => setActiveTab('pdam')}
            className={`flex items-center gap-3 flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'pdam'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FiDroplet size={20} />
            PDAM (Air)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'pln' && <PLNBilling />}
          {activeTab === 'pdam' && <PDAMBilling />}
        </div>
      </div>
    </div>
  );
};

export default BillingIndex;
