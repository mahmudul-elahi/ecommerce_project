import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-storefront', display: 'swap' });
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import QueryProvider from '../providers/QueryProvider';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'OmniShop | Discover independent shops',
  description: 'Find thoughtful collections and shop directly from independent stores.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-blue-100 selection:text-blue-950">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <Navbar />
                <CartDrawer />
                <main className="flex-1">{children}</main>
                <Footer />
                <Toaster
                  position="top-right"
                  richColors
                  theme="light"
                  closeButton
                  toastOptions={{
                    style: {
                      background: '#ffffff',
                      border: '1px solid #e7e5e4',
                      color: '#1c1917',
                      fontSize: '13px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                    },
                  }}
                />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
