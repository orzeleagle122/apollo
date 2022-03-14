import React from 'react';
import './App.css';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import {LayoutApp} from "./components/layout/Layout";
import ProductsPage from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path={`/product/:productId`} element={<LayoutApp><ProductDetails/></LayoutApp>}/>
            <Route path={`/`} element={<LayoutApp><ProductsPage/></LayoutApp>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
