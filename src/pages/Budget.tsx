import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PaymentSchedule {
  id: string
  installment_name: string
  due_date: string
  amount: number
  status: string
  paid_on?: string
}

interface BudgetAdditional {
  id: string
  expense_name: string
  vendor: string
  budgeted_amount: number
  actual_paid: number
}

const HOTEL_CONTRACT = 1625000

export default function Budget() {
  const [payments, setPayments] = useState<PaymentSchedule[]>([])
  const [expenses, setExpenses] = useState<BudgetAdditional[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newExpense, setNewExpense] = useState({ expense_name: '', vendor: '', budgeted_amount: 0 })

  useEffect(() => {
    const loadData = async () => {
      const [paymentsRes, expensesRes] = await Promise.all([
        supabase.from('payment_schedule').select('*').order('due_date'),
        supabase.from('budget_additional').select('*'),
      ])

      if (paymentsRes.data) setPayments(paymentsRes.data as PaymentSchedule[])
      if (expensesRes.data) setExpenses(expensesRes.data as BudgetAdditional[])
      setLoading(false)
    }

    loadData()
  }, [])

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    setSaving(true)

    const { error } = await supabase
      .from('payment_schedule')
      .update({ status: newStatus, paid_on: newStatus === 'PAID' ? new Date().toISOString().split('T')[0] : null })
      .eq('id', paymentId)

    if (error) {
      toast.error('Failed to update payment')
      console.error(error)
    } else {
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
      )
      toast.success('Payment status updated')
    }

    setSaving(false)
  }

  const handleAddExpense = async () => {
    if (!newExpense.expense_name.trim()) {
      toast.error('Please enter expense name')
      return
    }

    setSaving(true)

    const { data, error } = await supabase
      .from('budget_additional')
      .insert([{ ...newExpense, actual_paid: 0 }])
      .select()

    if (error) {
      toast.error('Failed to add expense')
      console.error(error)
    } else if (data) {
      setExpenses([...expenses, data[0] as BudgetAdditional])
      setNewExpense({ expense_name: '', vendor: '', budgeted_amount: 0 })
      toast.success('Expense added')
    }

    setSaving(false)
  }

  const handleDeleteExpense = async (expenseId: string) => {
    setSaving(true)

    const { error } = await supabase.from('budget_additional').delete().eq('id', expenseId)

    if (error) {
      toast.error('Failed to delete expense')
      console.error(error)
    } else {
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId))
      toast.success('Expense deleted')
    }

    setSaving(false)
  }

  const handleExpenseChange = async (expenseId: string, field: string, value: any) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expenseId ? { ...e, [field]: value } : e))
    )

    const { error } = await supabase
      .from('budget_additional')
      .update({ [field]: value })
      .eq('id', expenseId)

    if (error) console.error('Error updating expense:', error)
  }

  if (loading) return <div className="p-6">Loading...</div>

  const totalPaid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)
  const balanceDue = HOTEL_CONTRACT - totalPaid
  const totalBudgetedExpenses = expenses.reduce((sum, e) => sum + e.budgeted_amount, 0)
  const totalActualExpenses = expenses.reduce((sum, e) => sum + e.actual_paid, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Budget Tracking</h1>
        <p className="text-gray-600 text-sm mt-1">Wedding budget, payments, and additional expenses</p>
      </div>

      {/* Payment Alert */}
      {balanceDue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Pending Payment</p>
            <p className="text-red-800 text-sm">₹{balanceDue.toLocaleString()} due from hotel contract</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Hotel Contract Total</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">₹{HOTEL_CONTRACT.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Paid</p>
          <p className="text-3xl font-bold text-green-700 mt-2">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Balance Due</p>
          <p className={`text-3xl font-bold mt-2 ${balanceDue > 0 ? 'text-red-700' : 'text-green-700'}`}>
            ₹{balanceDue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Budget (Incl. Extras)</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">₹{(HOTEL_CONTRACT + totalBudgetedExpenses).toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Payment Schedule</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Installment</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700">Amount (₹)</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Paid On</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{payment.installment_name}</td>
                  <td className="px-6 py-4 text-gray-700">{payment.due_date}</td>
                  <td className="px-6 py-4 text-right text-gray-900 font-medium">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={payment.status}
                      onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                      disabled={saving}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${
                        payment.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{payment.paid_on || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Expenses */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Additional Expenses</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Add Expense Form */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="text"
              placeholder="Expense name"
              value={newExpense.expense_name}
              onChange={(e) => setNewExpense({ ...newExpense, expense_name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="text"
              placeholder="Vendor"
              value={newExpense.vendor}
              onChange={(e) => setNewExpense({ ...newExpense, vendor: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="Budgeted (₹)"
              value={newExpense.budgeted_amount || ''}
              onChange={(e) => setNewExpense({ ...newExpense, budgeted_amount: parseInt(e.target.value, 10) || 0 })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleAddExpense}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Expenses Table */}
          {expenses.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Expense</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Vendor</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Budgeted (₹)</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Actual (₹)</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Variance</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => {
                    const variance = expense.budgeted_amount - expense.actual_paid

                    return (
                      <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{expense.expense_name}</td>
                        <td className="px-4 py-3 text-gray-700">{expense.vendor}</td>
                        <td className="px-4 py-3 text-right text-gray-900">₹{expense.budgeted_amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <input
                            type="number"
                            value={expense.actual_paid}
                            onChange={(e) => handleExpenseChange(expense.id, 'actual_paid', parseInt(e.target.value, 10) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                          />
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${variance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          ₹{variance.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            disabled={saving}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                    <td colSpan={2} className="px-4 py-3 text-right text-gray-800">TOTAL:</td>
                    <td className="px-4 py-3 text-right text-gray-900">₹{totalBudgetedExpenses.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-900">₹{totalActualExpenses.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-700">₹{(totalBudgetedExpenses - totalActualExpenses).toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Budget Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border border-blue-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Overall Budget Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 font-medium">Hotel Contract</p>
            <p className="text-xl font-bold text-gray-800 mt-1">₹{HOTEL_CONTRACT.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Additional Expenses</p>
            <p className="text-xl font-bold text-gray-800 mt-1">₹{totalBudgetedExpenses.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Total Budget</p>
            <p className="text-xl font-bold text-blue-700 mt-1">₹{(HOTEL_CONTRACT + totalBudgetedExpenses).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Total Spent</p>
            <p className="text-xl font-bold text-gray-800 mt-1">₹{(totalPaid + totalActualExpenses).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
