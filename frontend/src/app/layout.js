import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Multi-Vendor Ecommerce',
  description: 'Multi-vendor ecommerce platform management system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
