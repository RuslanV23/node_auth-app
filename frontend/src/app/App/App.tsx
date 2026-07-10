import React from 'react';
import { Header } from '@/modules/Header';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../providers/Theme';
import { CartProvider } from '../providers/Cart';
import { FavouritesProvider } from '../providers/Favorities';
import { Footer } from '../../modules/Footer';
import { ProductsProvider } from '../providers/Products';
import { AuthProvider } from '../providers/Auth/AuthContext';
import { apiFromServer } from '@/api/apiFromServer';

export const App: React.FC = () => {
  // apiFromServer.getProductsServer().then((res) => {
  //   console.log(res);
  // })
  return (
    <>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <FavouritesProvider>
              <ProductsProvider>
                <Header></Header>
                <Outlet />
                <Footer></Footer>
              </ProductsProvider>
            </FavouritesProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </>
  );
};

export default App;
