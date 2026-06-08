'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils' // 🟢 IMPORTACIÓN DEL FORMATEADOR

export default function ReportsPage() {
  const [sales, setSales] = useState<any[]>([])
  const [report, setReport] = useState({ totalSales: 0, totalPurchases: 0, netProfit: 0, totalSalesCount: 0, totalPurchasesCount: 0 })
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [filterDate, setFilterDate] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('All')
  const [loading, setLoading] = useState(true)

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
        const month = dateRaw.monthValue ? dateRaw.monthValue - 1 : 0; 
        d = new Date(dateRaw.year, month, dateRaw.dayOfMonth || 1);
      } else {
        d = new Date(dateRaw);
      }
      if (isNaN(d.getTime())) return { display: 'N/A', iso: '' };
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return {
        display: `${day}/${month}/${year}`,
        iso: `${year}-${month}-${day}`
      };
    } catch {
      return { display: 'N/A', iso: '' };
    }
  };

  const filteredSales = sales.filter(s => {
    const total = s.saleDetails?.reduce((sum: number, d: any) => sum + (d.amountProducts * (d.product?.sellingValueProduct || 0)), 0) || 0
    const dateMeta = parseInvoiceDate(s.dateSale);
    
    const matchDate = filterDate ? dateMeta.iso === filterDate : true
    const matchPrice = total >= minPrice
    
    const matchPayment = selectedPaymentMethodId === 'All' 
      ? true 
      : s.paymentMethod?.idPaymentMethod === Number(selectedPaymentMethodId);
    
    return matchDate && matchPrice && matchPayment
  })

  if (loading) return <div className="p-5 text-center">Cargando reportes...</div>

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="d-flex justify-content-between mb-4">
        <Link href="/" className="btn btn-outline-secondary"><i className="bi bi-arrow-left"></i> Volver</Link>
        <h2 className="fw-bold">Reportes y Filtros</h2>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {/* 🟢 VALORES FORMATEADOS CON formatCurrency */}
        <div className="col-md-4"><div className="card p-3 shadow-sm border-0"><p className="text-muted small">Ingresos Totales</p><h3>{formatCurrency(report.totalSales)}</h3></div></div>
        <div className="col-md-4"><div className="card p-3 shadow-sm border-0"><p className="text-muted small">Egresos (Compras)</p><h3>{formatCurrency(report.totalPurchases)}</h3></div></div>
        <div className="col-md-4"><div className="card p-3 shadow-sm border-0"><p className="text-muted small">Utilidad Neta</p><h3 className="text-success">{formatCurrency(report.netProfit)}</h3></div></div>
      </div>

      {/* Panel de Filtros */}
      <div className="card shadow-sm border-0 p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label className="small fw-bold">Fecha exacta</label>
            <input type="date" className="form-control" onChange={e => setFilterDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">Precio Mínimo ($)</label>
            <input type="number" className="form-control" onChange={e => setMinPrice(Number(e.target.value))} />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold">Método de Pago</label>
            <select 
              className="form-select" 
              value={selectedPaymentMethodId} 
              onChange={e => setSelectedPaymentMethodId(e.target.value)}
            >
              <option value="All">Todos los métodos</option>
              {paymentMethods.map((method: any) => (
                <option key={method.idPaymentMethod} value={method.idPaymentMethod}>
                  {method.namePaymentMethod}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Historial Completo */}
      <div className="card shadow-sm border-0">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Fecha de Venta</th>
              <th>Método</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(s => {
              const dateMeta = parseInvoiceDate(s.dateSale);
              const totalVenta = s.saleDetails?.reduce((sum: number, d: any) => sum + (d.amountProducts * (d.product?.sellingValueProduct || 0)), 0) || 0;
              return (
                <tr key={s.idSale}>
                  <td>#{s.idSale}</td>
                  <td className="text-dark fw-medium">{dateMeta.display}</td>
                  <td>{s.paymentMethod?.namePaymentMethod || 'N/A'}</td>
                  {/* 🟢 TOTAL DE FILA FORMATEADO */}
                  <td className="fw-bold text-primary">
                    {formatCurrency(totalVenta)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}