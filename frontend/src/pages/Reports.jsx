import { useState, useEffect } from 'react';
import { ReportService } from '../api/services';
import { DollarSign, ShoppingBag, Ban, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await ReportService.getSalesReport(params);
      setReportData(res.data);
    } catch (err) {
      console.error('Failed to fetch sales report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const metrics = reportData?.metrics || {
    total_orders: 0,
    completed_orders: 0,
    cancelled_orders: 0,
    total_revenue: '0.00',
  };

  const topProducts = reportData?.top_selling_products || [];

  return (
    <div className="space-y-6">
      {/* Header & Date Range Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales & Performance Analytics</h1>
          <p className="text-sm text-slate-500">Monitor overall revenue, fulfillment volume, and high-demand stock.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <Calendar size={16} className="text-slate-400 ml-1" />
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
            <span>From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
            <span>To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center items-center text-slate-500 gap-2">
          <RefreshCw className="animate-spin" size={20} /> Updating metrics...
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Revenue</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  ${parseFloat(metrics.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{metrics.total_orders}</p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <ShoppingBag size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{metrics.completed_orders}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cancelled</p>
                <p className="text-2xl font-black text-rose-600 mt-1">{metrics.cancelled_orders}</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                <Ban size={24} />
              </div>
            </div>
          </div>

          {/* Top Selling Products Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">Top-Selling Products</h2>
              <span className="text-xs text-slate-400">Ranked by volume sold</span>
            </div>

            {topProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No sales data available for this range.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Rank</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3 text-right">Units Sold</th>
                    <th className="px-6 py-3 text-right">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((prod, index) => (
                    <tr key={prod.product__id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 font-bold text-slate-400 w-16">#{index + 1}</td>
                      <td className="px-6 py-3.5 font-medium text-slate-800">{prod.product__name}</td>
                      <td className="px-6 py-3.5 text-right font-semibold text-indigo-600">
                        {prod.total_quantity_sold} units
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-900">
                        ${parseFloat(prod.total_revenue_generated || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}