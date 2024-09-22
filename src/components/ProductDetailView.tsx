import { useNavigate } from 'react-router-dom'
import { Product } from '../types'
import styles from '../styles/ProductDetailView.module.css'

type ProductDetailViewProps = {
  product: Product | null
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const navigate = useNavigate()

  if (!product) {
    return <div>No product selected</div>
  }

  return (
    <div className={styles.productContainer}>
      <h1 className={styles.title}>Product Detail</h1>

      <button onClick={() => navigate('/')} className={styles.backButton}>
        &larr; Back to Search
      </button>
      <h2 className={styles.productName}>{product.name}</h2>
      <p className={styles.productCategory}>Category: {product.category}</p>
      <p className={styles.productDescription}>{product.description}</p>
      <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
      <img src={product.image} alt={product.name} className={styles.productImage} />
    </div>
  )
}

export default ProductDetailView
