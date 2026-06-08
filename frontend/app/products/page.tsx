'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { type Product } from '@/lib/data' 

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [liveCategories, setLiveCategories] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)
  
  // Modales principales
  const [showModal, setShowModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false) 
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  // Estados de control de tabla
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Formularios simplificados a tu nueva estructura de Entity Java
  const [formData, setFormData] = useState({
    nameProduct: '',
    idCategorySelected: '', 
    sellingValueProduct: 0,
  })

  const [newCategoryName, setNewCategoryName] = useState('') 

  // Cargar de forma unificada productos y categorías defendiendo la estructura de Arreglos
  const loadInitialData = async () => {
    setLoading(true)
    try {
      const [resProducts, resCategories] = await Promise.all([
        fetch('http://127.0.0.1:8080/api/products'),
        fetch('http://127.0.0.1:8080/api/categories') 
      ])

      const productsData = await resProducts.json()
      const categoriesData = await resCategories.json()

      // 🟢 CONTROL CRÍTICO: Asegura que el estado siempre sea una lista [] para evitar fallas en el .filter()
      setProducts(Array.isArray(productsData) ? productsData : [])
      setLiveCategories(Array.isArray(categoriesData) ? categoriesData : [])
      setLoading(false)
    } catch (err) {
      console.error("Error al sincronizar catálogo y categorías con Neon:", err)
      setProducts([])
      setLiveCategories([])
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      nameProduct: '',
      idCategorySelected: liveCategories[0]?.idCategory?.toString() || '', 
      sellingValueProduct: 0,
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    
    const currentCategoryId = typeof product.category === 'object' && product.category !== null
      ? (product.category as any).idCategory?.toString()
      : ''

    setFormData({
      nameProduct: product.nameProduct || '',
      idCategorySelected: currentCategoryId,
      sellingValueProduct: product.sellingValueProduct || 0,
    })
    setShowModal(true)
  }

  // Crear categorías directo en caliente (POST /api/categories)
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Category name cannot be empty')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameCategory: newCategoryName })
      })

      if (response.ok) {
        const savedCategory = await response.json()
        alert('🎉 Category created successfully!')
        
        const resCategories = await fetch('http://127.0.0.1:8080/api/categories')
        const categoriesData = await resCategories.json()
        setLiveCategories(Array.isArray(categoriesData) ? categoriesData : [])
        
        setFormData(prev => ({ ...prev, idCategorySelected: savedCategory.idCategory?.toString() }))
        setNewCategoryName('')
        setShowCategoryModal(false)
      } else {
        alert('Failed to save category.')
      }
    } catch (error) {
      console.error("Error creating category:", error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.nameProduct || !formData.idCategorySelected) {
      alert('Please fill in required fields')
      return
    }

    // 🟢 PAYLOAD LIMPIO: Sincronizado exactamente con las propiedades que conservó tu backend
    const payload = {
      nameProduct: formData.nameProduct,
      category: {
        idCategory: parseInt(formData.idCategorySelected) 
      },
      sellingValueProduct: formData.sellingValueProduct
    }

    try {
      let url = 'http://127.0.0.1:8080/api/products'
      let method = 'POST'

      if (editingProduct && editingProduct.idProduct) {
        url = `http://127.0.0.1:8080/api/products/${editingProduct.idProduct}`
        method = 'PUT'
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        loadInitialData() 
        setShowModal(false)
        setEditingProduct(null)
      } else {
        alert('Failed to save product. Check database relations or constraints.')
      }
    } catch (error) {
      console.error("Error en el envío de datos:", error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8080/api/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadInitialData()
        setShowDeleteConfirm(null)
      } else {
        alert('Could not delete product. It might be linked to existing sales/purchases.')
      }
    } catch (error) {
      console.error("Error al borrar:", error)
    }
  }

  // 🟢 FILTRADO BLINDADO: Evaluación segura para prevenir caídas de tipo de dato
  const safeProductsList = Array.isArray(products) ? products : [];

  const filteredProducts = safeProductsList.filter((product) => {
    if (!product) return false;
    const matchesSearch =
      (product.nameProduct?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (product.idProduct?.toString() === searchTerm.trim())
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-warning mb-2" role="status"></div>
          <p className="text-muted fw-bold">Sincronizando Productos y Categorías Reales...</p>
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
            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#fd7e14' }}>
              <i className="bi bi-tags-fill me-2"></i>Products Management
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Header Actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Products Catalog</h2>
            <p className="text-muted mb-0">Manage your product inventory</p>
          </div>
          <button className="btn btn-warning btn-lg text-white" onClick={openCreateModal}>
            <i className="bi bi-plus-circle me-2"></i>New Product
          </button>
        </div>

        {/* Input de Búsqueda */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-10">
                <div className="search-wrapper position-relative">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm('')
                    setCurrentPage(1)
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table con estructura corregida sin sku, image ni purchase cost */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Product ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th className="text-end">Sale Retail Price</th>
                    <th className="text-center">Current Stock</th>
                    <th className="text-center" style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">No products found in the catalog database.</td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.idProduct}>
                        <td><span className="text-muted fw-bold">#{product.idProduct}</span></td>
                        <td>
                          <div className="fw-medium text-dark">{product.nameProduct}</div>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark">
                            {typeof product.category === 'object' && product.category !== null
                              ? (product.category as any).nameCategory
                              : (product.category || 'General')}
                          </span>
                        </td>
                        <td className="text-end fw-semibold text-primary">
                          ${(product.sellingValueProduct || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-center">
                          <span className={`fw-bold ${
                            ((typeof product.stock === 'object' && product.stock !== null ? (product.stock as any).amountProducts : product.stock) || 0) === 0 
                              ? 'text-danger' 
                              : 'text-success'
                          }`}>
                            {typeof product.stock === 'object' && product.stock !== null
                              ? ((product.stock as any).amountProducts || 0)
                              : (product.stock || 0)}
                          </span>
                        </td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(product)}><i className="bi bi-pencil"></i></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => product.idProduct && setShowDeleteConfirm(product.idProduct)}><i className="bi bi-trash"></i></button>
                        </td>
                      </tr>
                    ))
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
                      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Principal Creación/Edición */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingProduct ? 'Update Product Catalog' : 'Create New Catalog Item'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Product Name *</label>
                  <input type="text" className="form-control" value={formData.nameProduct} onChange={(e) => setFormData({ ...formData, nameProduct: e.target.value })} placeholder="e.g., Gaseosa Coca Cola 350ml" />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Category *</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={formData.idCategorySelected}
                      onChange={(e) => setFormData({ ...formData, idCategorySelected: e.target.value })}
                    >
                      <option value="">-- Seleccione una categoría --</option>
                      {liveCategories.map((cat) => (
                        <option key={cat.idCategory} value={cat.idCategory}>
                          {cat.nameCategory}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn-outline-success" type="button" onClick={() => setShowCategoryModal(true)}>
                      <i className="bi bi-plus-lg me-1"></i>New Category
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Selling Retail Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input type="number" className="form-control" value={formData.sellingValueProduct} onChange={(e) => setFormData({ ...formData, sellingValueProduct: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Initial Inventory Stock</label>
                    <input type="number" className="form-control" value={editingProduct ? (typeof editingProduct.stock === 'object' ? (editingProduct.stock as any).amountProducts : editingProduct.stock) : 0} disabled />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="button" className="btn btn-warning text-white fw-bold" onClick={handleSubmit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Añadir Categoría en caliente */}
      {showCategoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-success text-white py-2">
                <h6 className="modal-title fw-bold"><i className="bi bi-folder-plus me-2"></i>Quick Add Category</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCategoryModal(false)}></button>
              </div>
              <div className="modal-body py-3">
                <div className="mb-2">
                  <label className="form-label small fw-bold">Category Name *</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="e.g., Bebidas, Mecato" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer p-2 border-0">
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                <button type="button" className="btn btn-sm btn-success" onClick={handleCreateCategory}>Save Category</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 shadow">
              <div className="modal-body p-4 text-center">
                <i className="bi bi-exclamation-triangle text-danger display-4 d-block mb-3"></i>
                <h5 className="fw-bold">Confirm Delete</h5>
                <p className="text-muted small">Are you sure you want to permanently delete this item from your Neon cluster catalog?</p>
                <div className="d-flex gap-2 justify-content-center mt-3">
                  <button className="btn btn-sm btn-light px-3" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
                  <button className="btn btn-sm btn-danger px-3" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>Delete Item</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}