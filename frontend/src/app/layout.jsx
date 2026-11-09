import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-storefront', display: 'swap' });
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ToastProvider } from '../context/ToastContext';
import QueryProvider from '../providers/QueryProvider';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';
import WishlistDrawer from '../components/common/WishlistDrawer';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Woodora | Interior Furniture & Handcrafted Living',
  description: 'High-end interior crafted furniture, artisanal collections and multi-vendor storefronts by Woodora.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full scroll-smooth`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-[#FAF3EA] selection:text-[#B88E2F]"
      >
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <Navbar />
                  <CartDrawer />
                  <WishlistDrawer />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <Toaster
                    position="bottom-left"
                    theme="light"
                    closeButton
                    toastOptions={{
                      style: {
                        background: '#ffffff',
                        border: '1px solid #e7e5e4',
                        color: '#1c1917',
                        fontSize: '13px',
                        borderRadius: '14px',
                        boxShadow: '0 14px 38px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
                        padding: '14px 18px',
                      },
                    }}
                  />
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
