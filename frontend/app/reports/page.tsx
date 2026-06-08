'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function ReportsPage() {
  const [sales, setSales] = useState<any[]>([])
  const [report, setReport] = useState({ totalSales: 0, totalPurchases: 0, netProfit: 0 })
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [filterDate, setFilterDate] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null) // Modal de detalle

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8080/api/sales/all').then(res => res.json()),
      fetch('http://127.0.0.1:8080/api/finance/report').then(res => res.json())
    ]).then(([salesData, reportData]) => {
      setSales(salesData)
      setReport(reportData)
      
      const uniqueMethods: any[] = [];
      const map = new Map();
      salesData.forEach((sale: any) => {
        if (sale.paymentMethod && !map.has(sale.paymentMethod.idPaymentMethod)) {
          map.set(sale.paymentMethod.idPaymentMethod, true);
          uniqueMethods.push(sale.paymentMethod);
        }
      });
      setPaymentMethods(uniqueMethods);
      setLoading(false)
    }).catch(err => {
      console.error("Error al cargar reportes:", err)
      setLoading(false)
    })
  }, [])

  const parseInvoiceDate = (dateRaw: any): { display: string; iso: string } => {
    if (!dateRaw) return { display: 'N/A', iso: '' };
    try {
      let d: Date;
      if (typeof dateRaw === 'object' && dateRaw.year) {
        d = new Date(dateRaw.year, dateRaw.monthValue - 1, dateRaw.dayOfMonth);
      } else {
        d = new Date(dateRaw);
      }
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return { display: `${day}/${month}/${year}`, iso: `${year}-${month}-${day}` };
    } catch { return { display: 'N/A', iso: '' }; }
  };

  const filteredSales = sales.filter(s => {
    const total = s.saleDetails?.reduce((sum: number, d: any) => sum + (d.amountProducts * (d.product?.sellingValueProduct || 0)), 0) || 0
    const dateMeta = parseInvoiceDate(s.dateSale);
    const matchDate = filterDate ? dateMeta.iso === filterDate : true
    const matchPrice = total >= minPrice
    const matchPayment = selectedPaymentMethodId === 'All' ? true : s.paymentMethod?.idPaymentMethod === Number(selectedPaymentMethodId);
    return matchDate && matchPrice && matchPayment
  })

  if (loading) return <div className="p-5 text-center">Cargando reportes...</div>

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="d-flex justify-content-between mb-4">
        <Link href="/" className="btn btn-outline-secondary"><i className="bi bi-arrow-left"></i> Volver</Link>
        <h2 className="fw-bold">Reportes de Ventas</h2>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4"><div className="card p-3 shadow-sm border-0"><p className="text-muted small">Ingresos Totales</p><h3>{formatCurrency(report.totalSales)}</h3></div></div>
        <div className="col-md-4"><div className="card p-3 shadow-sm border-0"><p className="text-muted small">Egresos (Compras)</p><h3>{formatCurrency(report.totalPurchases)}</h3></div></div>
        <div className="col-md-4"><div className="card p-3 shadow-sm border-0"><p className="text-muted small">Utilidad Neta</p><h3 className="text-success">{formatCurrency(report.netProfit)}</h3></div></div>
      </div>

      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="small fw-bold">Fecha</label>
            <input type="date" className="form-control" onChange={e => setFilterDate(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="small fw-bold">Método de Pago</label>
            <select className="form-select" onChange={e => setSelectedPaymentMethodId(e.target.value)}>
              <option value="All">Todos</option>
              {paymentMethods.map(m => <option key={m.idPaymentMethod} value={m.idPaymentMethod}>{m.namePaymentMethod}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr><th>Factura</th><th>Fecha</th><th>Método</th><th>Total</th></tr>
          </thead>
          <tbody>
            {filteredSales.map(s => {
              const totalVenta = s.saleDetails?.reduce((sum: number, d: any) => sum + (d.amountProducts * (d.product?.sellingValueProduct || 0)), 0) || 0;
              return (
                <tr key={s.idSale} onClick={() => setSelectedDetail({ ...s, total: totalVenta })} style={{ cursor: 'pointer' }}>
                  <td>#{s.idSale}</td>
                  <td>{parseInvoiceDate(s.dateSale).display}</td>
                  <td>{s.paymentMethod?.namePaymentMethod || 'N/A'}</td>
                  <td className="fw-bold text-primary">{formatCurrency(totalVenta)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL DETALLE DE VENTA */}
      {selectedDetail && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Detalle Factura #{selectedDetail.idSale}</h5>
                <button className="btn-close" onClick={() => setSelectedDetail(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Fecha:</strong> {parseInvoiceDate(selectedDetail.dateSale).display}</p>
                <table className="table table-striped">
                  <thead><tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
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
                <div className="text-end fs-5 fw-bold">Total: {formatCurrency(selectedDetail.total)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}