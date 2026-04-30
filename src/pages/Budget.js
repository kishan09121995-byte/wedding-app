import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
const HOTEL_CONTRACT = 1625000;
export default function Budget() {
    const [payments, setPayments] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newExpense, setNewExpense] = useState({ expense_name: '', vendor: '', budgeted_amount: 0 });
    useEffect(() => {
        const loadData = async () => {
            const [paymentsRes, expensesRes] = await Promise.all([
                supabase.from('payment_schedule').select('*').order('due_date'),
                supabase.from('budget_additional').select('*'),
            ]);
            if (paymentsRes.data)
                setPayments(paymentsRes.data);
            if (expensesRes.data)
                setExpenses(expensesRes.data);
            setLoading(false);
        };
        loadData();
    }, []);
    const handleStatusChange = async (paymentId, newStatus) => {
        setSaving(true);
        const { error } = await supabase
            .from('payment_schedule')
            .update({ status: newStatus, paid_on: newStatus === 'PAID' ? new Date().toISOString().split('T')[0] : null })
            .eq('id', paymentId);
        if (error) {
            toast.error('Failed to update payment');
            console.error(error);
        }
        else {
            setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p)));
            toast.success('Payment status updated');
        }
        setSaving(false);
    };
    const handleAddExpense = async () => {
        if (!newExpense.expense_name.trim()) {
            toast.error('Please enter expense name');
            return;
        }
        setSaving(true);
        const { data, error } = await supabase
            .from('budget_additional')
            .insert([{ ...newExpense, actual_paid: 0 }])
            .select();
        if (error) {
            toast.error('Failed to add expense');
            console.error(error);
        }
        else if (data) {
            setExpenses([...expenses, data[0]]);
            setNewExpense({ expense_name: '', vendor: '', budgeted_amount: 0 });
            toast.success('Expense added');
        }
        setSaving(false);
    };
    const handleDeleteExpense = async (expenseId) => {
        setSaving(true);
        const { error } = await supabase.from('budget_additional').delete().eq('id', expenseId);
        if (error) {
            toast.error('Failed to delete expense');
            console.error(error);
        }
        else {
            setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
            toast.success('Expense deleted');
        }
        setSaving(false);
    };
    const handleExpenseChange = async (expenseId, field, value) => {
        setExpenses((prev) => prev.map((e) => (e.id === expenseId ? { ...e, [field]: value } : e)));
        const { error } = await supabase
            .from('budget_additional')
            .update({ [field]: value })
            .eq('id', expenseId);
        if (error)
            console.error('Error updating expense:', error);
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    const totalPaid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
    const balanceDue = HOTEL_CONTRACT - totalPaid;
    const totalBudgetedExpenses = expenses.reduce((sum, e) => sum + e.budgeted_amount, 0);
    const totalActualExpenses = expenses.reduce((sum, e) => sum + e.actual_paid, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Budget Tracking" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Wedding budget, payments, and additional expenses" })] }), balanceDue > 0 && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-red-900", children: "Pending Payment" }), _jsxs("p", { className: "text-red-800 text-sm", children: ["\u20B9", balanceDue.toLocaleString(), " due from hotel contract"] })] })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Hotel Contract Total" }), _jsxs("p", { className: "text-3xl font-bold text-gray-800 mt-2", children: ["\u20B9", HOTEL_CONTRACT.toLocaleString()] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Paid" }), _jsxs("p", { className: "text-3xl font-bold text-green-700 mt-2", children: ["\u20B9", totalPaid.toLocaleString()] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Balance Due" }), _jsxs("p", { className: `text-3xl font-bold mt-2 ${balanceDue > 0 ? 'text-red-700' : 'text-green-700'}`, children: ["\u20B9", balanceDue.toLocaleString()] })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Budget (Incl. Extras)" }), _jsxs("p", { className: "text-3xl font-bold text-blue-700 mt-2", children: ["\u20B9", (HOTEL_CONTRACT + totalBudgetedExpenses).toLocaleString()] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gray-100 p-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Payment Schedule" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Installment" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Due Date" }), _jsx("th", { className: "px-6 py-3 text-right font-semibold text-gray-700", children: "Amount (\u20B9)" }), _jsx("th", { className: "px-6 py-3 text-center font-semibold text-gray-700", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold text-gray-700", children: "Paid On" })] }) }), _jsx("tbody", { children: payments.map((payment) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-gray-900 font-medium", children: payment.installment_name }), _jsx("td", { className: "px-6 py-4 text-gray-700", children: payment.due_date }), _jsxs("td", { className: "px-6 py-4 text-right text-gray-900 font-medium", children: ["\u20B9", payment.amount.toLocaleString()] }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("select", { value: payment.status, onChange: (e) => handleStatusChange(payment.id, e.target.value), disabled: saving, className: `px-3 py-1 rounded-full text-sm font-semibold border-0 ${payment.status === 'PAID'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-orange-100 text-orange-800'}`, children: [_jsx("option", { value: "PENDING", children: "PENDING" }), _jsx("option", { value: "PAID", children: "PAID" })] }) }), _jsx("td", { className: "px-6 py-4 text-gray-700 text-sm", children: payment.paid_on || '-' })] }, payment.id))) })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "bg-gray-100 p-4 border-b border-gray-200", children: _jsx("h2", { className: "text-lg font-bold text-gray-800", children: "Additional Expenses" }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg", children: [_jsx("input", { type: "text", placeholder: "Expense name", value: newExpense.expense_name, onChange: (e) => setNewExpense({ ...newExpense, expense_name: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsx("input", { type: "text", placeholder: "Vendor", value: newExpense.vendor, onChange: (e) => setNewExpense({ ...newExpense, vendor: e.target.value }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsx("input", { type: "number", placeholder: "Budgeted (\u20B9)", value: newExpense.budgeted_amount || '', onChange: (e) => setNewExpense({ ...newExpense, budgeted_amount: parseInt(e.target.value, 10) || 0 }), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm" }), _jsxs("button", { onClick: handleAddExpense, disabled: saving, className: "flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add"] })] }), expenses.length > 0 && (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Expense" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-700", children: "Vendor" }), _jsx("th", { className: "px-4 py-3 text-right font-semibold text-gray-700", children: "Budgeted (\u20B9)" }), _jsx("th", { className: "px-4 py-3 text-right font-semibold text-gray-700", children: "Actual (\u20B9)" }), _jsx("th", { className: "px-4 py-3 text-right font-semibold text-gray-700", children: "Variance" }), _jsx("th", { className: "px-4 py-3 text-center font-semibold text-gray-700", children: "Action" })] }) }), _jsx("tbody", { children: expenses.map((expense) => {
                                                const variance = expense.budgeted_amount - expense.actual_paid;
                                                return (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 text-gray-900 font-medium", children: expense.expense_name }), _jsx("td", { className: "px-4 py-3 text-gray-700", children: expense.vendor }), _jsxs("td", { className: "px-4 py-3 text-right text-gray-900", children: ["\u20B9", expense.budgeted_amount.toLocaleString()] }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsx("input", { type: "number", value: expense.actual_paid, onChange: (e) => handleExpenseChange(expense.id, 'actual_paid', parseInt(e.target.value, 10) || 0), className: "w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm" }) }), _jsxs("td", { className: `px-4 py-3 text-right font-medium ${variance >= 0 ? 'text-green-700' : 'text-red-700'}`, children: ["\u20B9", variance.toLocaleString()] }), _jsx("td", { className: "px-4 py-3 text-center", children: _jsx("button", { onClick: () => handleDeleteExpense(expense.id), disabled: saving, className: "p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50", children: _jsx(Trash2, { className: "w-4 h-4 text-red-600" }) }) })] }, expense.id));
                                            }) }), _jsx("tfoot", { children: _jsxs("tr", { className: "border-t-2 border-gray-300 bg-gray-50 font-semibold", children: [_jsx("td", { colSpan: 2, className: "px-4 py-3 text-right text-gray-800", children: "TOTAL:" }), _jsxs("td", { className: "px-4 py-3 text-right text-gray-900", children: ["\u20B9", totalBudgetedExpenses.toLocaleString()] }), _jsxs("td", { className: "px-4 py-3 text-right text-gray-900", children: ["\u20B9", totalActualExpenses.toLocaleString()] }), _jsxs("td", { className: "px-4 py-3 text-right text-green-700", children: ["\u20B9", (totalBudgetedExpenses - totalActualExpenses).toLocaleString()] }), _jsx("td", {})] }) })] }) }))] })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 shadow-sm border border-blue-200", children: [_jsx("h2", { className: "text-lg font-bold text-gray-800 mb-4", children: "Overall Budget Summary" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Hotel Contract" }), _jsxs("p", { className: "text-xl font-bold text-gray-800 mt-1", children: ["\u20B9", HOTEL_CONTRACT.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Additional Expenses" }), _jsxs("p", { className: "text-xl font-bold text-gray-800 mt-1", children: ["\u20B9", totalBudgetedExpenses.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Total Budget" }), _jsxs("p", { className: "text-xl font-bold text-blue-700 mt-1", children: ["\u20B9", (HOTEL_CONTRACT + totalBudgetedExpenses).toLocaleString()] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-600 font-medium", children: "Total Spent" }), _jsxs("p", { className: "text-xl font-bold text-gray-800 mt-1", children: ["\u20B9", (totalPaid + totalActualExpenses).toLocaleString()] })] })] })] })] }));
}
