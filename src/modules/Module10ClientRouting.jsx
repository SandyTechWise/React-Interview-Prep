import React, { useState } from 'react'
import {
  MemoryRouter,
  Routes,
  Route,
  NavLink,
  Link,
  Outlet,
  useParams,
  useSearchParams,
  useNavigate,
  Navigate,
} from 'react-router-dom'
import styles from './Module10ClientRouting.module.css'

const PRODUCTS = [
  { id: 'p1', name: 'MacBook Pro M3', category: 'laptops', price: 1999 },
  { id: 'p2', name: 'Dell XPS 15', category: 'laptops', price: 1499 },
  { id: 'p3', name: 'Pixel 8 Pro', category: 'phones', price: 999 },
  { id: 'p4', name: 'iPhone 15 Pro', category: 'phones', price: 1099 },
]

// ----------------------------------------------------------------------------
// Topic 44: Parent Layout Component with <Outlet />
// Topic 43: NavLink with isActive styling
// ----------------------------------------------------------------------------
function StoreLayout({ isAuthenticated }) {
  return (
    <div className={styles.card}>
      <nav className={styles.navBar}>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
          }
        >
          Catalog
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
          }
        >
          Admin Portal (Protected)
        </NavLink>
        <NavLink
          to="/auth"
          className={({ isActive }) =>
            `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
          }
        >
          Auth ({isAuthenticated ? 'Signed In' : 'Signed Out'})
        </NavLink>
      </nav>

      {/* Topic 44: <Outlet /> renders whichever child route is currently active */}
      <Outlet />
    </div>
  )
}

// ----------------------------------------------------------------------------
// Topic 44: Index Route & Topic 45: Storing State in the URL (useSearchParams)
// ----------------------------------------------------------------------------
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'

  const filtered =
    currentCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === currentCategory)

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h3 style={{ margin: 0, fontSize: '15px' }}>Products Catalog</h3>
        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
          URL State: ?category={currentCategory}
        </span>
      </div>

      {/* Topic 45: Updating query params in URL without losing page state */}
      <div className={styles.filterGroup}>
        {['all', 'laptops', 'phones'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSearchParams(cat === 'all' ? {} : { category: cat })}
            className={`${styles.filterBtn} ${
              currentCategory === cat ? styles.filterBtnActive : ''
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.itemList}>
        {filtered.map((item) => (
          // Topic 43: <Link> for client-side navigation without page reload
          // Topic 46: Navigating to dynamic route with ID parameter
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className={styles.itemCard}
          >
            <div>
              <strong>{item.name}</strong>
              <div style={{ fontSize: '12px', color: '#777' }}>
                Category: {item.category}
              </div>
            </div>
            <span style={{ fontWeight: 600 }}>${item.price}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// Topic 46: Dynamic Routes URL parameters (useParams)
// Topic 47: useNavigate (Programmatic navigation)
// ----------------------------------------------------------------------------
function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.id === id)

  if (!product) {
    return (
      <div>
        <p>Product not found.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className={styles.btnSecondary}
        >
          ← Back to Catalog
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>{product.name}</h3>
      <p style={{ margin: '0 0 12px 0', color: '#5f6368', fontSize: '13px' }}>
        Dynamic Parameter extracted via <code>useParams()</code>: id ={' '}
        <strong>"{id}"</strong>
      </p>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a73e8', marginBottom: '14px' }}>
        ${product.price}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Topic 47: Programmatic navigation with navigate(-1) for history back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={styles.btnSecondary}
        >
          ← Go Back (-1)
        </button>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className={styles.btnPrimary}
        >
          View All Products
        </button>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// Topic 52: Protected Route Wrapper Component
// ----------------------------------------------------------------------------
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // Topic 47: <Navigate replace /> to prevent back-button loops to unauthorized pages
    return <Navigate to="/auth" replace />
  }
  return children
}

function AdminDashboard() {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h3 style={{ margin: 0, fontSize: '15px' }}>🔒 Secret Admin Dashboard</h3>
        <span className={`${styles.badge} ${styles.badgeSuccess}`}>Authorized</span>
      </div>
      <p style={{ fontSize: '13px', color: '#444' }}>
        Welcome to the restricted admin control panel. You passed the ProtectedRoute guard!
      </p>
    </div>
  )
}

function AuthPage({ isAuthenticated, onToggleAuth }) {
  return (
    <div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>Authentication Simulator</h3>
      <p style={{ fontSize: '13px', color: '#5f6368', margin: '0 0 12px 0' }}>
        Current status:{' '}
        <strong>{isAuthenticated ? '🟢 Logged In' : '🔴 Logged Out'}</strong>
      </p>

      <button
        type="button"
        onClick={onToggleAuth}
        className={isAuthenticated ? styles.btnSecondary : styles.btnPrimary}
      >
        {isAuthenticated ? 'Sign Out' : 'Sign In as Admin'}
      </button>

      <div className={styles.infoBox}>
        Try clicking "Admin Portal" in the top navigation while logged out to see{' '}
        <code>&lt;ProtectedRoute&gt;</code> automatically redirect here!
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// Main Module 10 Component
// ----------------------------------------------------------------------------
export default function Module10ClientRouting() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Client-Side Routing (React Router)</h2>
      <p className={styles.subtitle}>
        Nested layouts, URL search parameters, dynamic segments, and route protection.
      </p>

      {/* Topic 42: MemoryRouter simulates browser navigation cleanly inside this module */}
      <MemoryRouter initialEntries={['/products']}>
        <Routes>
          {/* Topic 44: Nested route layout */}
          <Route path="/" element={<StoreLayout isAuthenticated={isAuthenticated} />}>
            {/* Topic 44: Index route */}
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductList />} />
            {/* Topic 46: Dynamic route parameter */}
            <Route path="products/:id" element={<ProductDetail />} />

            {/* Topic 52: Protected Route */}
            <Route
              path="admin"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="auth"
              element={
                <AuthPage
                  isAuthenticated={isAuthenticated}
                  onToggleAuth={() => setIsAuthenticated((prev) => !prev)}
                />
              }
            />
          </Route>
        </Routes>
      </MemoryRouter>
    </div>
  )
}

