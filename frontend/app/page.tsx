'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

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
  const [purchases, setPurchases] = useState<any[]>([]) // 🟢 NUEVO: Estado para cargar histórico de compras
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const [resProducts, resSales, resPurchases] = await Promise.all([
          fetch('http://127.0.0.1:8080/api/products'),
          fetch('http://127.0.0.1:8080/api/sales'),
          fetch('http://127.0.0.1:8080/api/purchases') // 🟢 Trae las compras guardadas en Neon
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

  // =========================================================
  // 🟢 BALANCES FINANCIEROS Y DE INVENTARIO EN TIEMPO REAL
  // =========================================================
  
  // 1. FINANZAS: Ingresos brutos generados por las ventas relacionales
  const totalSalesRevenue = (Array.isArray(sales) ? sales : []).reduce((sum, sale) => {
    const details = sale.saleDetails || [];
    return sum + details.reduce((s: number, d: any) => s + ((d.product?.sellingValueProduct || 0) * (d.amountProducts || 0)), 0);
  }, 0);

  // 2. FINANZAS: Costos totales por reabastecimiento (Egresos de Compras)
  const totalPurchasesCost = (Array.isArray(purchases) ? purchases : []).reduce((sum, purchase) => {
    const details = purchase.purchaseDetails || [];
    return sum + details.reduce((s: number, d: any) => s + ((d.purchasePriceUnit || d.purchaseProductPrice || 0) * (d.amountPurchased || 0)), 0);
  }, 0);

  // 3. FINANZAS: Utilidad Neta real (Ganancia = Ventas - Compras)
  const netProfit = totalSalesRevenue - totalPurchasesCost;

  // 4. INVENTARIO: Conteo total de unidades físicas en tbl_stocks vía tu ProductServiceImpl
  const totalStockUnits = (Array.isArray(products) ? products : []).reduce((sum, p) => sum + (p.stock || 0), 0);

  // 5. INVENTARIO: Alertas de stock crítico (Productos con stock <= 5)
  const lowStockItems = (Array.isArray(products) ? products : []).filter(p => (p.stock ?? 0) <= 5);

  // Historial resumido para las tablas inferiores
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
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-box-seam text-primary me-2 fs-3"></i>
            <span className="fw-bold">InventoryPro</span>
          </Link>
          <div className="d-flex align-items-center">
            <span className="badge bg-dark px-3 py-2 fs-6 me-3">
              <i className="bi bi-cash-stack me-2 text-warning"></i>Net Gain: ${netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-2">Welcome to InventoryPro</h1>
          <p className="lead text-muted">Integrated ERP Panel tracking your live relational database infrastructure</p>
        </div>

        {/* 🟢 TARJETAS DE INDICADORES (KPIs RECIÉN RESTAURADOS) */}
        <div className="row g-4 mb-5">
          {/* Tarjeta Finanzas: Ingresos */}
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#e7f1ff', color: '#0d6efd' }}>
                  <i className="bi bi-cash-coin fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1">${totalSalesRevenue.toFixed(2)}</h3>
                <p className="text-muted small mb-0">Total Sales Gross Revenue</p>
              </div>
            </div>
          </div>
          
          {/* Tarjeta Finanzas: Utilidad Real */}
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#f8d7da', color: '#dc3545' }}>
                  <i className="bi bi-graph-up text-danger fs-4"></i>
                </div>
                <h3 className={`fw-bold mb-1 ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                  ${netProfit.toFixed(2)}
                </h3>
                <p className="text-muted small mb-0">Net Profits Balance</p>
              </div>
            </div>
          </div>

          {/* Tarjeta Inventario: Unidades Físicas Reales */}
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, backgroundColor: '#e2d9f3', color: '#6f42c1' }}>
                  <i className="bi bi-clipboard-data fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1 text-purple" style={{ color: '#6f42c1' }}>{totalStockUnits}</h3>
                <p className="text-muted small mb-0">Total Inventory Units</p>
              </div>
            </div>
          </div>

          {/* Tarjeta Catálogo: SKUs */}
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

        {/* Bloque de Módulos */}
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

        {/* Tablas de Monitoreo Inferiores */}
        <div className="row mt-5">
          {/* Historial de Facturas */}
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
                      {recentSales.length === 0 ? (
                        <tr><td colSpan={3} className="text-center py-4 text-muted">No sales logged in your Neon cluster yet.</td></tr>
                      ) : (
                        recentSales.map((sale: any) => {
                          const details = sale.saleDetails || [];
                          const amountPaid = details.reduce((sum: number, d: any) => sum + ((d.product?.sellingValueProduct || 0) * (d.amountProducts || 0)), 0);
                          
                          return (
                            <tr key={sale.idSale}>
                              <td><span className="fw-bold text-primary">#INV-{sale.idSale}</span></td>
                              <td>
                                <div className="small text-truncate" style={{ maxWidth: '240px' }}>
                                  {details.map((d: any) => d.product?.nameProduct).join(', ') || 'N/A'}
                                </div>
                              </td>
                              <td className="text-end fw-bold text-dark">${amountPaid.toFixed(2)}</td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Alertas de Abastecimiento Crítico */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold"><i className="bi bi-exclamation-octagon text-danger me-2"></i>Critical Low Stock Alerts</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Product Name</th>
                        <th className="text-center">Stock Left</th>
                        <th className="text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.length === 0 ? (
                        <tr><td colSpan={3} className="text-center py-4 text-success fw-semibold">🎉 All inventory balances stable.</td></tr>
                      ) : (
                        lowStockItems.slice(0, 4).map((product: any) => (
                          <tr key={product.idProduct}>
                            <td><div className="fw-medium small text-dark">{product.nameProduct}</div></td>
                            <td className="text-center fw-bold text-danger">{product.stock ?? 0} units</td>
                            <td className="text-end">
                              <span className={`badge px-2 py-1 ${(product.stock ?? 0) === 0 ? 'bg-danger text-white' : 'bg-warning text-dark'}`}>
                                {(product.stock ?? 0) === 0 ? 'Out of Stock' : 'Low Stock'}
                              </span>
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
        </div>
      </main>

      <footer className="bg-white border-top py-4 mt-auto">
        <div className="container text-center text-muted">
          <p className="mb-0">InventoryPro ERP System - UdeA Techniques Laboratory Integration</p>
        </div>
      </footer>
    </div>
  )
}