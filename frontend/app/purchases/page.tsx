'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { type Product, type Supplier } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

interface PurchaseItem {
  product: Product
  quantity: number
  price: number
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]) 
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [liveCategories, setLiveCategories] = useState<any[]>([]) 
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'create' | 'management'>('create')

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null) // 🟢 NUEVO: Estado detalle
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null) 

  const [providerForm, setProviderForm] = useState({
    nitProvider: '',
    nameProvider: '',
    phoneNumber: '',
    email: '',
  })

  const [newProduct, setNewProduct] = useState({
    nameProduct: '',
    idCategorySelected: '', 
    sellingValueProduct: 0,
  })

  const loadInitialData = async () => {
    try {
      const [resSuppliers, resProducts, resCategories, resPurchases] = await Promise.all([
        fetch('http://127.0.0.1:8080/api/providers'),
        fetch('http://127.0.0.1:8080/api/products'),
        fetch('http://127.0.0.1:8080/api/categories'),
        fetch('http://127.0.0.1:8080/api/purchases')
      ])
      
      setSuppliers(await resSuppliers.json())
      setAvailableProducts(await resProducts.json())
      setLiveCategories(await resCategories.json())
      setPurchases(await resPurchases.json())
      setLoading(false)
    } catch (error) {
      console.error("Fallo al sincronizar datos con el POS Server:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const openCreateSupplierModal = () => {
    setEditingSupplier(null)
    setProviderForm({ nitProvider: '', nameProvider: '', phoneNumber: '', email: '' })
    setShowSupplierModal(true)
  }

  const openEditSupplierModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setProviderForm({
      nitProvider: supplier.nitProvider || '',
      nameProvider: supplier.nameProvider || '',
      phoneNumber: supplier.phoneNumber || '',
      email: supplier.email || '',
    })
    setShowSupplierModal(true)
  }

  const handleSupplierSubmit = async () => {
    if (!providerForm.nameProvider || !providerForm.nitProvider) {
      alert('Please fill in required fields')
      return
    }

    try {
      let url = 'http://127.0.0.1:8080/api/providers'
      let method = 'POST'

      if (editingSupplier && editingSupplier.idProvider) {
        url = `http://127.0.0.1:8080/api/providers/${editingSupplier.idProvider}`
        method = 'PUT'
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerForm)
      })

      if (response.ok) {
        alert(editingSupplier ? '✅ Provider updated successfully!' : '🎉 Supplier created successfully!')
        await loadInitialData()
        setShowSupplierModal(false)
      } else {
        alert('Failed to save supplier in database.')
      }
    } catch (error) {
      console.error("Error saving provider:", error)
    }
  }

  const handleSupplierDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider?')) return

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/providers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('🗑️ Provider deleted successfully.')
        loadInitialData()
      } else {
        alert('❌ Constraint Error: Cannot delete a provider with historical purchase orders.')
      }
    } catch (error) {
      console.error("Delete call failed:", error)
    }
  }

  const addProductToPurchase = (product: Product) => {
    const existing = purchaseItems.find((item) => item.product.idProduct === product.idProduct)
    if (existing) {
      setPurchaseItems((prev) =>
        prev.map((item) => item.product.idProduct === product.idProduct ? { ...item, quantity: item.quantity + 1 } : item)
      )
    } else {
      setPurchaseItems((prev) => [...prev, { product, quantity: 1, price: 0 }])
    }
    setShowAddProductModal(false)
  }

  const updatePurchaseItem = (productId: number, field: 'quantity' | 'price', value: number) => {
    setPurchaseItems((prev) => prev.map((item) => item.product.idProduct === productId ? { ...item, [field]: value } : item))
  }

  const removePurchaseItem = (productId: number) => {
    setPurchaseItems((prev) => prev.filter((item) => item.product.idProduct !== productId))
  }

  const purchaseTotal = purchaseItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const createProduct = async () => {
    if (!newProduct.nameProduct || !newProduct.idCategorySelected) {
      alert('Please fill in required fields')
      return
    }

    const payload = {
      nameProduct: newProduct.nameProduct,
      category: { idCategory: parseInt(newProduct.idCategorySelected) },
      sellingValueProduct: Number(newProduct.sellingValueProduct)
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const savedProduct = await response.json()
        addProductToPurchase(savedProduct)
        await loadInitialData()
        setShowProductModal(false)
      }
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  const registerPurchaseOrder = async () => {
    if (!selectedSupplier || purchaseItems.length === 0) return

    const purchaseRequest = {
      provider: { idProvider: Number(selectedSupplier.idProvider) },
      purchaseDetails: purchaseItems.map((item) => ({
        amountPurchased: Number(item.quantity),
        purchasePriceUnit: Number(item.price),
        purchaseProductPrice: Number(item.price),
        purchasePrice: Number(item.price),
        product: { idProduct: Number(item.product.idProduct) }
      }))
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseRequest)
      })

      if (response.ok) {
        alert(`🎉 Purchase Order registered successfully!`)
        setPurchaseItems([])
        setSelectedSupplier(null)
        await loadInitialData() 
      } else {
        alert('❌ Error processing purchase order.')
      }
    } catch (error) {
      console.error("Fallo de red:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success mb-2" role="status"></div>
          <p className="text-muted fw-bold">Synchronizing Purchase Module...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <Link href="/" className="btn btn-light me-3"><i className="bi bi-arrow-left"></i></Link>
            <Link href="/" className="navbar-brand d-flex align-items-center">
              <i className="bi bi-box-seam text-primary me-2 fs-4"></i>
              <span className="fw-bold">InventoryPro</span>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge bg-success fs-6 px-3 py-2">
              <i className="bi bi-box-seam-fill me-2"></i>Procurement center
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Procurement & Supply Chain</h2>
            <p className="text-muted mb-0">Issue purchase orders and audit provider relationships</p>
          </div>
          <div className="btn-group shadow-sm">
            <button className={`btn ${activeTab === 'create' ? 'btn-success text-white fw-bold' : 'btn-white'}`} onClick={() => setActiveTab('create')}>
              <i className="bi bi-cart-plus me-2"></i>New Purchase Order
            </button>
            <button className={`btn ${activeTab === 'management' ? 'btn-success text-white fw-bold' : 'btn-white'}`} onClick={() => setActiveTab('management')}>
              <i className="bi bi-journal-check me-2"></i>History & Directory
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <>
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold"><i className="bi bi-building me-2 text-success"></i>Supplier Assignment</h5>
              </div>
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-md-8">
                    <label className="form-label fw-medium">Select Supplier</label>
                    <select
                      className="form-select"
                      value={selectedSupplier?.idProvider || ''}
                      onChange={(e) => {
                        const supplier = suppliers.find((s) => s.idProvider === parseInt(e.target.value))
                        setSelectedSupplier(supplier || null)
                      }}
                    >
                      <option value="">-- Select a supplier --</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.idProvider} value={supplier.idProvider}>
                          {supplier.nameProvider} [NIT: {supplier.nitProvider}]
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <button className="btn btn-outline-success w-100" onClick={openCreateSupplierModal}>
                      <i className="bi bi-plus-circle me-2"></i>Quick Add Supplier
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold"><i className="bi bi-box me-2 text-success"></i>Purchase Items</h5>
                <div>
                  <button className="btn btn-outline-success me-2" onClick={() => setShowAddProductModal(true)}><i className="bi bi-plus me-1"></i>Add Existing Product</button>
                  <button className="btn btn-success" onClick={() => setShowProductModal(true)}><i className="bi bi-plus-circle me-1"></i>Create New Product</button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th className="text-center" style={{ width: 120 }}>Quantity</th>
                        <th className="text-center" style={{ width: 150 }}>Purchase Cost</th>
                        <th className="text-end" style={{ width: 120 }}>Subtotal</th>
                        <th className="text-center" style={{ width: 60 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-5 text-muted">No products added yet.</td>
                        </tr>
                      ) : (
                        purchaseItems.map((item) => (
                          <tr key={item.product.idProduct}>
                            <td><div className="fw-medium">{item.product.nameProduct}</div></td>
                            <td><input type="number" className="form-control form-control-sm text-center mx-auto" value={item.quantity} min={1} onChange={(e) => item.product.idProduct && updatePurchaseItem(item.product.idProduct, 'quantity', parseInt(e.target.value) || 1)} style={{ width: 80 }} /></td>
                            <td><input type="number" className="form-control form-control-sm text-center mx-auto" value={item.price} min={0} step="0.01" onChange={(e) => item.product.idProduct && updatePurchaseItem(item.product.idProduct, 'price', parseFloat(e.target.value) || 0)} style={{ width: 100 }} /></td>
                            <td className="text-end fw-bold">{formatCurrency(item.price * item.quantity)}</td>
                            <td className="text-center"><button className="btn btn-sm btn-outline-danger" onClick={() => item.product.idProduct && removePurchaseItem(item.product.idProduct)}><i className="bi bi-trash"></i></button></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm col-md-6 offset-md-6">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted d-block">Grand Total:</span>
                  <span className="fs-3 fw-bold text-success">{formatCurrency(purchaseTotal)}</span>
                </div>
                <button className="btn btn-success btn-lg" onClick={() => setShowConfirmModal(true)} disabled={!selectedSupplier || purchaseItems.length === 0}>
                  <i className="bi bi-check-all me-1"></i>Dispatch Purchase Order
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'management' && (
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-bold text-success"><i className="bi bi-receipt me-2"></i>Historical Purchases List</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Supplier Target</th>
                          <th className="text-end">Disbursement</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.length === 0 ? (
                          <tr><td colSpan={3} className="text-center py-4 text-muted">No historic purchases saved.</td></tr>
                        ) : (
                          purchases.map((p: any) => (
                          <tr 
                            key={p.idPurchase} 
                            onClick={() => {
                              // 🟢 AQUÍ ESTÁ EL CAMBIO CRÍTICO:
                              // Usamos 'purchaseProductPrice' que es el campo que confirmó tu consola
                              const total = p.purchaseDetails?.reduce((sum: number, d: any) => 
                                sum + ((d.purchaseProductPrice || 0) * (d.amountPurchased || 0)), 0) || 0;
                              
                              setSelectedDetail({ ...p, total });
                            }} 
                            style={{ cursor: 'pointer' }}>
                              <td><span className="badge bg-light text-dark fw-bold">#ORD-{p.idPurchase}</span></td>
                              <td>
                                <div className="fw-bold small">{p.provider?.nameProvider}</div>
                                {p.purchaseDetails?.map((d: any, idx: number) => (
                                  <small key={idx} className="d-block text-muted">• {d.product?.nameProduct} ({d.amountPurchased} units)</small>
                                ))}
                              </td>
                              <td className="text-end fw-bold text-success">
                                {formatCurrency(p.purchaseDetails?.reduce((sum: number, d: any) => sum + (d.amountPurchased * (d.purchasePriceUnit || d.purchaseProductPrice || 0)), 0) || 0)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-people me-2"></i>Providers Directory</h5>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>Provider Name</th>
                          <th className="text-center" style={{ width: 110 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map((prov) => (
                          <tr key={prov.idProvider}>
                            <td>
                              <div className="fw-bold">{prov.nameProvider}</div>
                              <small className="text-muted font-monospace">{prov.nitProvider}</small>
                            </td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditSupplierModal(prov)}><i className="bi bi-pencil"></i></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => prov.idProvider && handleSupplierDelete(prov.idProvider)}><i className="bi bi-trash"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: PROVEEDOR */}
      {showSupplierModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{editingSupplier ? '✏️ Edit Supplier Metadata' : '🎉 Create New Supplier'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowSupplierModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Corporate Name *</label>
                  <input type="text" className="form-control" value={providerForm.nameProvider} onChange={(e) => setProviderForm({ ...providerForm, nameProvider: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">NIT / Tax ID *</label>
                  <input type="text" className="form-control" value={providerForm.nitProvider} onChange={(e) => setProviderForm({ ...providerForm, nitProvider: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowSupplierModal(false)}>Cancel</button>
                <button type="button" className="btn btn-success" onClick={handleSupplierSubmit}>Save Supplier</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR PRODUCTO EXISTENTE */}
      {showAddProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddProductModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {availableProducts.map((p) => (
                    <div key={p.idProduct} className="col-md-4">
                      <div className="card h-100" style={{ cursor: 'pointer' }} onClick={() => addProductToPurchase(p)}>
                        <div className="card-body p-2"><h6 className="fw-bold small">{p.nameProduct}</h6></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR PRODUCTO */}
      {showProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Create New Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
              </div>
              <div className="modal-body">
                <input className="form-control mb-3" placeholder="Name" onChange={e => setNewProduct({...newProduct, nameProduct: e.target.value})} />
                <select className="form-select mb-3" onChange={e => setNewProduct({...newProduct, idCategorySelected: e.target.value})}>
                  <option>Select Category</option>
                  {liveCategories.map(cat => <option key={cat.idCategory} value={cat.idCategory}>{cat.nameCategory}</option>)}
                </select>
                <input className="form-control" type="number" placeholder="Price" onChange={e => setNewProduct({...newProduct, sellingValueProduct: parseFloat(e.target.value)})} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={createProduct}>Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VERIFICACIÓN DE ORDEN */}
      {showConfirmModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Verify Purchase Order</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-2"><strong>Supplier:</strong> {selectedSupplier?.nameProvider}</p>
                <p>Please review your order items before processing:</p>
                <ul className="list-group mb-3">
                  {purchaseItems.map((item) => (
                    <li key={item.product.idProduct} className="list-group-item d-flex justify-content-between">
                      {item.product.nameProduct} (x{item.quantity})
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span>{formatCurrency(purchaseTotal)}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Back</button>
                <button className="btn btn-primary" onClick={() => {
                  setShowConfirmModal(false);
                  registerPurchaseOrder();
                }}>
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{/* 🟢 MODAL: DETALLES DE COMPRA (CORREGIDO) */}
      {selectedDetail && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Purchase Order Details #{selectedDetail.idPurchase}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDetail(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Supplier:</strong> {selectedDetail.provider?.nameProvider}</p>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetail.purchaseDetails?.map((d: any, i: number) => {
                      // 🟢 USAMOS PURCHASEPRODUCTPRICE QUE ES EL CAMPO QUE VIENE EN TU API
                      const precio = d.purchaseProductPrice || 0;
                      const cantidad = d.amountPurchased || 0;
                      return (
                        <tr key={i}>
                          <td>{d.product?.nameProduct}</td>
                          <td className="text-center">{cantidad}</td>
                          <td className="text-end">{formatCurrency(precio)}</td>
                          <td className="text-end">{formatCurrency(precio * cantidad)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="text-end fs-5 fw-bold">Total: {formatCurrency(selectedDetail.total || 0)}</div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setSelectedDetail(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
         </div>
  )
}