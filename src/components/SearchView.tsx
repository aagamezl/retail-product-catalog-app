import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Product } from '../types'
import styles from '../styles/SearchView.module.css'

type SearchViewProps = {
  setSelectedProduct: (product: Product) => void
}

const ITEMS_PER_PAGE = 5

const SearchView: React.FC<SearchViewProps> = ({ setSelectedProduct }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const navigate = useNavigate()

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (term.length > 2) {
        fetch(`http://localhost:3000/search?name=${term}`)
          .then(res => res.json())
          .then(result => setSearchResults(result.data));
      }
    }, 300),
    [debounce, setSearchResults]
  )

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm)
    } else {
      fetch(`http://localhost:3000/products?offset=${(currentPage - 1) * ITEMS_PER_PAGE}&limit=${ITEMS_PER_PAGE}`)
        .then(res => res.json())
        .then(result => {
          setSearchResults(result.data)
          setTotalPages(Math.ceil(result.total / ITEMS_PER_PAGE))
        });
    }
  }, [searchTerm, debouncedSearch, currentPage])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    navigate(`/product/${product.id}`)
  }

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.title}>Product Search</h1>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for products..."
        className={styles.searchInput}
      />
      <ul className={styles.resultsList}>
        {searchResults.map((product) => (
          <li key={product.id} onClick={() => handleProductClick(product)} className={styles.resultItem}>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productCategory}>{product.category}</p>
            </div>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            // onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function debounce<F extends (...args: string[]) => unknown>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout>

  return function (this: unknown, ...args: Parameters<F>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

export default SearchView
