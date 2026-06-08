'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

const modules = [
  {
    title: 'Sales (POS)',
    description: 'Point of Sale system to process customer orders and generate invoices',
    icon: 'bi-cart-check-fill',
    color: '#0d6efd',
    bgColor: '#e7f1ff',
    href: '/sales',
  },
  {
    title: 'Purchase Orders',
    description: 'Manage supplier orders and inventory restocking records',
    icon: 'bi-truck',
    color: '#198754',
    bgColor: '#d1e7dd',
    href: '/purchases',
  },
  {
    title: 'Inventory Control',
    description: 'Track stock levels, audit physical units and monitor product logs',
    icon: 'bi-clipboard-data-fill',
    color: '#6f42c1',
    bgColor: '#e2d9f3',
    href: '/inventory',
  },
  {
    title: 'Products Catalog',
    description: 'Add, edit and manage your lean product core criteria',
    icon: 'bi-tags-fill',
    color: '#fd7e14',
    bgColor: '#ffe5d0',
    href: '/products',
  },
  {
    title: 'Finance & Reports',
    description: 'View profit margins, historical sales data and cost structures',
    icon: 'bi-graph-up-arrow',
    color: '#dc3545',
    bgColor: '#f8d7da',
    href: '/reports',
  }
]

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null) // 🟢 NUEVO: Estado detalle

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const [resProducts, resSales, resPurchases] = await Promise.all([
          fetch('http://127.0.0.1:8080/api/products'),
          fetch('http://127.0.0.1:8080/api/sales/all'),
          fetch('http://127.0.0.1:8080/api/purchases')
        ])

        setProducts(await resProducts.json())
        setSales(await resSales.json())
        setPurchases(await resPurchases.json())
        setLoading(false)
      } catch (error) {
        console.error("Fallo al conectar el Dashboard principal con Spring Boot:", error)
        setLoading(false)
      }
    }

    fetchDashboardMetrics()
  }, [])

  const totalSalesRevenue = (Array.isArray(sales) ? sales : []).reduce((sum, sale) => {
    const details = sale.saleDetails || [];
    return sum + details.reduce((s: number, d: any) => s + ((d.product?.sellingValueProduct || 0) * (d.amountProducts || 0)), 0);
  }, 0);

  const totalPurchasesCost = (Array.isArray(purchases) ? purchases : []).reduce((sum, purchase) => {
    const details = purchase.purchaseDetails || [];
    return sum + details.reduce((s: number, d: any) => s + ((d.purchaseProductPrice || 0) * (d.amountPurchased || 0)), 0);
  }, 0);

  const netProfit = totalSalesRevenue - totalPurchasesCost;
  const totalStockUnits = (Array.isArray(products) ? products : []).reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockItems = (Array.isArray(products) ? products : []).filter(p => (p.stock ?? 0) <= 5);
  const recentSales = (Array.isArray(sales) ? [...sales] : []).reverse().slice(0, 4);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p className="text-muted fw-bold">Compiling Real-Time ERP Metrics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-box-seam text-primary me-2 fs-3"></i>
            <span className="fw-bold">Marcel's Tecnologia celular y fotografia</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className="badge bg-dark px-3 py-2 fs-6 me-3">
              <i className="bi bi-cash-stack me-2 text-warning"></i>Net Gain: {formatCurrency(netProfit)}
            </span>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-2">Marcel's</h1>
          <p className="lead text-muted">Tecnologia celular y fotografia</p>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#e7f1ff', color: '#0d6efd' }}>
                  <i className="bi bi-cash-coin fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1">{formatCurrency(totalSalesRevenue)}</h3>
                <p className="text-muted small mb-0">Total Sales Gross Revenue</p>
              </div>
            </div>
          </div>
          
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#f8d7da', color: '#dc3545' }}>
                  <i className="bi bi-graph-up text-danger fs-4"></i>
                </div>
                <h3 className={`fw-bold mb-1 ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(netProfit)}</h3>
                <p className="text-muted small mb-0">Net Profits Balance</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#e2d9f3', color: '#6f42c1' }}>
                  <i className="bi bi-clipboard-data fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1" style={{ color: '#6f42c1' }}>{totalStockUnits}</h3>
                <p className="text-muted small mb-0">Total Inventory Units</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#ffe5d0', color: '#fd7e14' }}>
                  <i className="bi bi-exclamation-triangle fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1 text-warning">{lowStockItems.length}</h3>
                <p className="text-muted small mb-0">Critical Low Stock Items</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="h4 fw-bold mb-4">Core Modules Menu</h2>
        <div className="row g-4">
          {modules.map((module) => (
            <div key={module.title} className="col-md-6 col-lg-4">
              <Link href={module.href} className="text-decoration-none">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="mb-3 rounded d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: module.bgColor, color: module.color }}>
                      <i className={`bi ${module.icon} fs-5`}></i>
                    </div>
                    <h5 className="card-title fw-bold text-dark mb-2">{module.title}</h5>
                    <p className="card-text text-muted small mb-4">{module.description}</p>
                    <div className="d-flex align-items-center small fw-bold" style={{ color: module.color }}>
                      <span>Open operational view</span>
                      <i className="bi bi-arrow-right ms-2"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold"><i className="bi bi-receipt text-primary me-2"></i>Recent Sales Log</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Invoice ID</th>
                        <th>Products Sold</th>
                        <th className="text-end">Paid Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale: any) => {
                        const details = sale.saleDetails || [];
                        const amountPaid = details.reduce((sum: number, d: any) => sum + ((d.product?.sellingValueProduct || 0) * (d.amountProducts || 0)), 0);
                        return (
                          <tr key={sale.idSale} onClick={() => setSelectedDetail({ ...sale, total: amountPaid })} style={{ cursor: 'pointer' }}>
                            <td><span className="fw-bold text-primary">#INV-{sale.idSale}</span></td>
                            <td><div className="small text-truncate" style={{ maxWidth: '240px' }}>{details.map((d: any) => d.product?.nameProduct).join(', ')}</div></td>
                            <td className="text-end fw-bold text-dark">{formatCurrency(amountPaid)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🟢 MODAL: DETALLES DE VENTA */}
      {selectedDetail && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Sale Invoice Details #{selectedDetail.idSale}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedDetail(null)}></button>
              </div>
              <div className="modal-body">
                <table className="table table-striped">
                  <thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr></thead>
                  <tbody>
                    {selectedDetail.saleDetails?.map((d: any, i: number) => (
                      <tr key={i}>
                        <td>{d.product?.nameProduct}</td>
                        <td>{d.amountProducts}</td>
                        <td>{formatCurrency(d.product?.sellingValueProduct || 0)}</td>
                        <td>{formatCurrency(d.amountProducts * (d.product?.sellingValueProduct || 0))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-end fs-5 fw-bold">Total: {formatCurrency(selectedDetail.total || 0)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}