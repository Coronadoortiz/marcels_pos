'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { type Product } from '@/lib/data' 
import { formatCurrency } from '@/lib/utils'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [liveCategories, setLiveCategories] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)
  
  // 🟢 ESTADOS AÑADIDOS PARA EL MODAL
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [newMethodName, setNewMethodName] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Función para cargar métodos de pago
  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8080/api/payment-methods')
      const data = await res.json()
      setPaymentMethods(data)
    } catch (err) { console.error("Error fetching methods", err) }
  }

  const handleAdd = async () => {
    if (!newMethodName.trim()) return;
    await fetch('http://127.0.0.1:8080/api/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namePaymentMethod: newMethodName })
    })
    setNewMethodName(''); fetchPaymentMethods();
  }

  const handleDelete = async (id: number) => {
    if (paymentMethods.length <= 1) return alert("Debe haber al menos un método de pago.");
    await fetch(`http://127.0.0.1:8080/api/payment-methods/${id}`, { method: 'DELETE' });
    fetchPaymentMethods();
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    await fetch(`http://127.0.0.1:8080/api/payment-methods/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namePaymentMethod: editName })
    })
    setEditingId(null); fetchPaymentMethods();
  }

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const [resProducts, resCategories, resPaymentMethods] = await Promise.all([
          fetch('http://127.0.0.1:8080/api/products'),
          fetch('http://127.0.0.1:8080/api/categories'),
          fetch('http://127.0.0.1:8080/api/payment-methods')
        ])

        const productsData = await resProducts.json()
        const categoriesData = await resCategories.json()
        const paymentMethodsData = await resPaymentMethods.json()

        setProducts(Array.isArray(productsData) ? productsData : [])
        setLiveCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setPaymentMethods(Array.isArray(paymentMethodsData) ? paymentMethodsData : [])
        setLoading(false)
      } catch (err) {
        console.error("Fallo conectando con Spring Boot en inventarios:", err)
        setProducts([])
        setLiveCategories([])
        setLoading(false)
      }
    }

    fetchInventoryData()
  }, [])
  

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    
    const matchesSearch = product.nameProduct?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    const categoryName = typeof product.category === 'object' && product.category !== null
      ? (product.category as any).nameCategory
      : product.category;

    const matchesCategory =
      selectedCategory === 'All' || categoryName === selectedCategory

    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Out of Stock', class: 'bg-danger text-white' }
    }
    if (stock <= 10) {
      return { label: 'Low Stock', class: 'bg-warning text-dark' }
    }
    return { label: 'In Stock', class: 'bg-success text-white' }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p className="text-muted fw-bold">Conectando con Neon & Spring Boot...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <Link href="/" className="btn btn-light me-3">
              <i className="bi bi-arrow-left"></i>
            </Link>
            <Link href="/" className="navbar-brand d-flex align-items-center">
              <i className="bi bi-box-seam text-primary me-2 fs-4"></i>
              <span className="fw-bold">InventoryPro</span>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            {/* 🟢 BOTÓN DE GESTIÓN AÑADIDO */}
            <button 
              className="btn btn-outline-secondary btn-sm me-3" 
              onClick={() => { fetchPaymentMethods(); setShowPaymentModal(true); }}
            >
              <i className="bi bi-credit-card-2-front me-1"></i> Manage Payments
            </button>
            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#6f42c1' }}>
              <i className="bi bi-clipboard-data-fill me-2"></i>Inventory Management
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Stats Row */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, backgroundColor: '#e2d9f3', color: '#6f42c1' }}>
                  <i className="bi bi-box-seam fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">{products.length}</h4>
                  <small className="text-muted">Total Products</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, backgroundColor: '#d1e7dd', color: '#198754' }}>
                  <i className="bi bi-check-circle fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">
                    {products.filter((p) => (p.stock || 0) > 10).length}
                  </h4>
                  <small className="text-muted">In Stock</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, backgroundColor: '#fff3cd', color: '#856404' }}>
                  <i className="bi bi-exclamation-triangle fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">
                    {products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length}
                  </h4>
                  <small className="text-muted">Low Stock</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48, backgroundColor: '#f8d7da', color: '#842029' }}>
                  <i className="bi bi-x-circle fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">
                    {products.filter((p) => (p.stock || 0) === 0).length}
                  </h4>
                  <small className="text-muted">Out of Stock</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                >
                  <option value="All">All Categories</option>
                  {liveCategories.map((cat: any) => (
                    <option key={cat.idCategory} value={cat.nameCategory}>
                      {cat.nameCategory}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setCurrentPage(1)
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 fw-bold text-dark">
              <i className="bi bi-table me-2" style={{ color: '#6f42c1' }}></i>
              Current Stock Inventory List
              <span className="badge bg-secondary ms-2">{filteredProducts.length} items</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>Product ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th className="text-center" style={{ width: 180 }}>Available Units</th>
                    <th className="text-end" style={{ width: 150 }}>Sale Retail Price</th>
                    <th className="text-center" style={{ width: 150 }}>Status Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
                        <i className="bi bi-search fs-1 d-block mb-3"></i>
                        <p className="mb-0">No matching items found in warehouse stock</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => {
                      const stockVal = product.stock || 0;
                      const status = getStockStatus(stockVal);
                      return (
                        <tr key={product.idProduct}>
                          <td><span className="text-muted fw-bold">#{product.idProduct}</span></td>
                          <td><div className="fw-medium text-dark">{product.nameProduct}</div></td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {typeof product.category === 'object' && product.category !== null
                                ? (product.category as any).nameCategory
                                : (product.category || 'General')}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`fw-bold ${stockVal === 0 ? 'text-danger' : stockVal <= 10 ? 'text-warning' : 'text-success'}`}>
                              {stockVal} units
                            </span>
                          </td>
                          {/* 🟢 PRECIO FORMATEADO */}
                          <td className="text-end fw-semibold text-primary">
                            {formatCurrency(product.sellingValueProduct || 0)}
                          </td>
                          <td className="text-center">
                            <span className={`badge ${status.class}`}>{status.label}</span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                  {filteredProducts.length} products
                </small>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><i className="bi bi-chevron-left"></i></button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}><i className="bi bi-chevron-right"></i></button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🟢 MODAL GESTIÓN PAGOS */}
      {showPaymentModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gestión de Métodos de Pago</h5>
                <button className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input className="form-control" placeholder="Nombre nuevo método" value={newMethodName} onChange={(e) => setNewMethodName(e.target.value)} />
                  <button className="btn btn-primary" onClick={handleAdd}>Agregar</button>
                </div>
                <ul className="list-group">
                  {paymentMethods.map(m => (
                    <li key={m.idPaymentMethod} className="list-group-item d-flex justify-content-between align-items-center">
                      {editingId === m.idPaymentMethod ? (
                        <input className="form-control form-control-sm me-2" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      ) : (
                        <span>{m.namePaymentMethod}</span>
                      )}
                      <div>
                        {editingId === m.idPaymentMethod ? (
                          <button className="btn btn-sm btn-success me-2" onClick={() => handleUpdate(m.idPaymentMethod)}>Guardar</button>
                        ) : (
                          <button className="btn btn-sm btn-warning me-2" onClick={() => { setEditingId(m.idPaymentMethod); setEditName(m.namePaymentMethod); }}>Modificar</button>
                        )}
                        {paymentMethods.length > 1 && (
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.idPaymentMethod)}>Eliminar</button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}