import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar />
      <Header />
      <main className={`mt-16 flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8 flex-1">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;
