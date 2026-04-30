import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useGuestStore } from '../store/guestStore';
import { supabase } from '../lib/supabase';
import { Download, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
export default function PlateCount() {
    const getConfirmedByFunction = useGuestStore((state) => state.getConfirmedByFunction);
    const getJainPaxByFunction = useGuestStore((state) => state.getJainPaxByFunction);
    const [cateringItems, setCateringItems] = useState([]);
    const [functions, setFunctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [manualOverrides, setManualOverrides] = useState({});
    useEffect(() => {
        const loadData = async () => {
            const [cateringRes, functionsRes] = await Promise.all([
                supabase.from('catering_items').select('*'),
                supabase.from('functions').select('*'),
            ]);
            if (cateringRes.data)
                setCateringItems(cateringRes.data);
            if (functionsRes.data)
                setFunctions(functionsRes.data);
            setLoading(false);
        };
        loadData();
    }, []);
    const functionMap = new Map(functions.map((f) => [f.id, f.name]));
    const plateData = cateringItems.map((item) => {
        const fnKey = item.function_id.replace('-', '');
        const actualPax = getConfirmedByFunction(fnKey);
        const actualJain = getJainPaxByFunction(fnKey);
        const regularPax = actualPax - actualJain;
        const billingPax = Math.max(item.min_guarantee_pax, actualPax);
        const bufferPax = Math.ceil(billingPax * 1.1);
        const totalCost = billingPax * item.rate_per_plate;
        const manualPax = manualOverrides[item.id] ?? 0;
        return {
            id: item.id,
            meal: item.meal_name,
            function: functionMap.get(item.function_id) || item.function_id,
            venue: item.venue,
            regular: regularPax,
            jain: actualJain,
            actual: actualPax,
            mg: item.min_guarantee_pax,
            billingPax,
            buffer: bufferPax,
            rate: item.rate_per_plate,
            totalCost,
            manualPax,
        };
    });
    const handleManualOverride = (itemId, value) => {
        setManualOverrides((prev) => ({ ...prev, [itemId]: value }));
    };
    const exportToExcel = () => {
        const exportData = plateData.map((row) => ({
            'Meal': row.meal,
            'Function': row.function,
            'Venue': row.venue,
            'Regular': row.regular,
            'Jain': row.jain,
            'Total Actual': row.actual,
            'MG': row.mg,
            'Billing Pax': row.billingPax,
            'Buffer (+10%)': row.buffer,
            'Rate (₹)': row.rate,
            'Total Cost (₹)': row.totalCost,
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Plate Count');
        XLSX.writeFile(wb, 'plate-count.xlsx');
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    const totalBillingPax = plateData.reduce((sum, row) => sum + row.billingPax, 0);
    const totalCost = plateData.reduce((sum, row) => sum + row.totalCost, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Plate Count Analysis" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Confirmed plates by meal with Jain split and billing calculations" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => window.print(), className: "flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors", children: [_jsx(Printer, { className: "w-4 h-4" }), "Print"] }), _jsxs("button", { onClick: exportToExcel, className: "flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), "Export Excel"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Items" }), _jsx("p", { className: "text-3xl font-bold text-gray-800 mt-2", children: plateData.length })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Actual Pax" }), _jsx("p", { className: "text-3xl font-bold text-blue-700 mt-2", children: plateData.reduce((sum, r) => sum + r.actual, 0) })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Billing Pax" }), _jsx("p", { className: "text-3xl font-bold text-purple-700 mt-2", children: totalBillingPax })] }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("p", { className: "text-gray-600 text-sm font-medium", children: "Total Cost" }), _jsxs("p", { className: "text-3xl font-bold text-green-700 mt-2", children: ["\u20B9", totalCost.toLocaleString()] })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Meal" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Function" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-700", children: "Venue" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Regular" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Jain" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Total Actual" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "MG" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Billing Pax" }), _jsx("th", { className: "px-6 py-3 text-center text-sm font-semibold text-gray-700", children: "Buffer (+10%)" }), _jsx("th", { className: "px-6 py-3 text-right text-sm font-semibold text-gray-700", children: "Rate (\u20B9)" }), _jsx("th", { className: "px-6 py-3 text-right text-sm font-semibold text-gray-700", children: "Total Cost (\u20B9)" })] }) }), _jsx("tbody", { children: plateData.map((row) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm text-gray-900 font-medium", children: row.meal }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-700", children: row.function }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-700", children: row.venue }), _jsx("td", { className: "px-6 py-4 text-center text-sm text-gray-700", children: row.regular }), _jsx("td", { className: "px-6 py-4 text-center text-sm text-gray-700", children: row.jain }), _jsx("td", { className: "px-6 py-4 text-center text-sm font-semibold text-blue-600", children: row.actual }), _jsx("td", { className: "px-6 py-4 text-center text-sm text-gray-700", children: row.mg }), _jsx("td", { className: "px-6 py-4 text-center text-sm font-semibold text-purple-600", children: row.billingPax }), _jsx("td", { className: "px-6 py-4 text-center text-sm text-gray-700", children: row.buffer }), _jsxs("td", { className: "px-6 py-4 text-right text-sm text-gray-700", children: ["\u20B9", row.rate] }), _jsxs("td", { className: "px-6 py-4 text-right text-sm font-semibold text-green-600", children: ["\u20B9", row.totalCost.toLocaleString()] })] }, row.id))) }), _jsx("tfoot", { children: _jsxs("tr", { className: "border-t-2 border-gray-300 bg-gray-50 font-semibold", children: [_jsx("td", { colSpan: 7, className: "px-6 py-4 text-right text-gray-800", children: "TOTAL:" }), _jsx("td", { className: "px-6 py-4 text-center text-purple-700", children: totalBillingPax }), _jsx("td", { colSpan: 2 }), _jsxs("td", { className: "px-6 py-4 text-right text-green-700", children: ["\u20B9", totalCost.toLocaleString()] })] }) })] }) }), _jsxs("div", { className: "bg-white rounded-lg p-6 shadow-sm border border-gray-200", children: [_jsx("h3", { className: "text-lg font-bold text-gray-800 mb-4", children: "Manual Overrides" }), _jsx("p", { className: "text-gray-600 text-sm mb-4", children: "Override pax count for specific meals (late night snacks, extra breakfast, etc.)" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: plateData.map((row) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("label", { className: "text-sm font-medium text-gray-700 flex-1", children: [row.meal, " (", row.function, ")"] }), _jsx("input", { type: "number", min: "0", value: manualOverrides[row.id] ?? 0, onChange: (e) => handleManualOverride(row.id, parseInt(e.target.value, 10) || 0), className: "w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm", placeholder: "0" }), _jsx("span", { className: "text-xs text-gray-500", children: "pax" })] }, row.id))) })] })] }));
}
