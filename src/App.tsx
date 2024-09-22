import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import SearchView from './components/SearchView'
import ProductDetailView from './components/ProductDetailView'
import { Product } from './types'
import styles from './styles/App.module.css'

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<SearchView setSelectedProduct={setSelectedProduct} />} />
          <Route path="/product/:id" element={<ProductDetailView product={selectedProduct} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
