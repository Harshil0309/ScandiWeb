import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { ApolloClient , InMemoryCache , ApolloProvider , HttpLink, from } from '@apollo/client';
import {onError} from '@apollo/client/link/error'

const errorLink = onError(({graphqlErrors}) => {
  if(graphqlErrors) {
    graphqlErrors.map(({message}) => {
      alert(`graphql error occured ${message}`)
    });
  }
})


const link = from([
  errorLink,
  new HttpLink({uri : "http://localhost:4000"})
])
const client = new ApolloClient({
  cache : new InMemoryCache(),
  link: link
})

import Layout from './pages/Layout';
import THEME from './theme';
import ProductsList from './components/productsList/ProductsList';
import Product from './components/Product/Product';
import Cart from './components/cart/Cart';

function App() {
  return (
    <ApolloProvider client={client}>
    <ThemeProvider theme={THEME}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route exact path="/:categoryId/:productId" element={<Product />} />
            <Route exact path="/:categoryId" element={<ProductsList />} />
            <Route exact path="/cart" element={<Cart />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
