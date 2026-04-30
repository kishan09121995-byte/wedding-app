import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
export default function HotelBilling() {
    const [hotels, setHotels] = useState([]);
    const [guests, setGuests] = useState([]);
    const [catering, setCatering] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            const [hotelsRes, guestsRes, cateringRes] = await Promise.all([
                supabase.from('hotel_settings').select('*'),
                supabase.from('guests').select('id,name,pax_total,hotel_id,check_in,check_out').eq('room_needed', true),
                supabase.from('catering_items').select('*'),
            ]);
            if (hotelsRes.data)
                setHotels(hotelsRes.data);
            if (guestsRes.data)
                setGuests(guestsRes.data);
            if (cateringRes.data)
                setCatering(cateringRes.data);
            setLoading(false);
        };
        loadData();
    }, []);
    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut)
            return 2;
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        return Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
    };
    const calculateRoomCost = (hotelId) => {
        const hotel = hotels.find((h) => h.id === hotelId);
        if (!hotel)
            return 0;
        const hotelGuests = guests.filter((g) => g.hotel_id === hotelId);
        const roomsNeeded = Math.ceil(hotelGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0));
        const billingRooms = Math.max(hotel.contracted_rooms, roomsNeeded);
        const avgNights = hotelGuests.length > 0
            ? Math.ceil(hotelGuests.reduce((sum, g) => sum + calculateNights(g.check_in, g.check_out), 0) / hotelGuests.length)
            : 2;
        return billingRooms * hotel.rate_per_room_night * avgNights;
    };
    const calculateMealCost = (hotelId) => {
        const hotelGuests = guests.filter((g) => g.hotel_id === hotelId);
        const totalPax = hotelGuests.reduce((sum, g) => sum + g.pax_total, 0);
        return catering.reduce((sum, item) => {
            const billingPax = Math.max(item.min_guarantee_pax, totalPax);
            return sum + billingPax * item.rate_per_plate;
        }, 0);
    };
    const exportPDF = async () => {
        const element = document.getElementById('billing-report');
        if (!element)
            return;
        const canvas = await html2canvas(element, { scale: 2 });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let y = 10;
        pdf.text('Wedding Hotel Billing Report', 10, y);
        y += 10;
        let pageHeight = pdf.internal.pageSize.getHeight();
        let remainingHeight = imgHeight;
        while (remainingHeight > 0) {
            const heightToPrint = Math.min(pageHeight - y - 10, remainingHeight);
            const sourceY = imgHeight - remainingHeight;
            pdf.addImage(imgData, 'PNG', 10, y, imgWidth - 20, (heightToPrint * (imgWidth - 20)) / imgWidth);
            remainingHeight -= heightToPrint;
            if (remainingHeight > 0) {
                pdf.addPage();
                y = 10;
                pageHeight = pdf.internal.pageSize.getHeight();
            }
        }
        pdf.save('hotel-billing-report.pdf');
    };
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading..." });
    const grandTotal = hotels.reduce((sum, h) => sum + calculateRoomCost(h.id) + calculateMealCost(h.id), 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-800", children: "Hotel Billing" }), _jsx("p", { className: "text-gray-600 text-sm mt-1", children: "Room and meal costs per hotel" })] }), _jsxs("button", { onClick: exportPDF, className: "flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors", children: [_jsx(Download, { className: "w-4 h-4" }), "Export PDF"] })] }), _jsxs("div", { className: "bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-green-200", children: [_jsx("p", { className: "text-green-700 text-sm font-medium", children: "GRAND TOTAL (All Hotels)" }), _jsxs("p", { className: "text-4xl font-bold text-green-900 mt-2", children: ["\u20B9", grandTotal.toLocaleString()] }), _jsx("p", { className: "text-green-700 text-xs mt-2", children: "Rooms + Meals + Catering" })] }), _jsx("div", { id: "billing-report", className: "space-y-6", children: hotels.map((hotel) => {
                    const hotelGuests = guests.filter((g) => g.hotel_id === hotel.id);
                    const roomCost = calculateRoomCost(hotel.id);
                    const mealCost = calculateMealCost(hotel.id);
                    const subtotal = roomCost + mealCost;
                    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsxs("div", { className: "bg-gray-100 p-4 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-bold text-gray-800", children: hotel.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Rate: \u20B9", hotel.rate_per_room_night, "/night | Contracted: ", hotel.contracted_rooms, " rooms"] })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-3", children: "Guest Summary" }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "bg-blue-50 p-3 rounded-lg border border-blue-200", children: [_jsx("p", { className: "text-blue-700 font-medium", children: "Guests" }), _jsx("p", { className: "text-2xl font-bold text-blue-900", children: hotelGuests.length })] }), _jsxs("div", { className: "bg-purple-50 p-3 rounded-lg border border-purple-200", children: [_jsx("p", { className: "text-purple-700 font-medium", children: "Total Pax" }), _jsx("p", { className: "text-2xl font-bold text-purple-900", children: hotelGuests.reduce((sum, g) => sum + g.pax_total, 0) })] }), _jsxs("div", { className: "bg-green-50 p-3 rounded-lg border border-green-200", children: [_jsx("p", { className: "text-green-700 font-medium", children: "Rooms Needed" }), _jsx("p", { className: "text-2xl font-bold text-green-900", children: Math.ceil(hotelGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0)) })] })] })] }), _jsxs("div", { className: "mb-6 pb-6 border-b border-gray-200", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-3", children: "Room Billing" }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Rate per night:" }), _jsxs("span", { className: "font-medium", children: ["\u20B9", hotel.rate_per_room_night.toLocaleString()] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Billing rooms:" }), _jsx("span", { className: "font-medium", children: Math.max(hotel.contracted_rooms, Math.ceil(hotelGuests.reduce((sum, g) => sum + Math.ceil(g.pax_total / 2), 0))) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Nights:" }), _jsx("span", { className: "font-medium", children: "2" })] }), _jsxs("div", { className: "flex justify-between text-lg font-bold text-blue-700 pt-2 border-t border-gray-200", children: [_jsx("span", { children: "Room Cost:" }), _jsxs("span", { children: ["\u20B9", roomCost.toLocaleString()] })] })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-3", children: "Meal Billing" }), _jsx("div", { className: "space-y-2 text-sm", children: catering.map((item) => {
                                                    const totalPax = hotelGuests.reduce((sum, g) => sum + g.pax_total, 0);
                                                    const billingPax = Math.max(item.min_guarantee_pax, totalPax);
                                                    const mealTotal = billingPax * item.rate_per_plate;
                                                    return (_jsxs("div", { className: "flex justify-between items-center p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-800", children: item.meal_name }), _jsxs("p", { className: "text-xs text-gray-600", children: ["MG: ", item.min_guarantee_pax, " | Rate: \u20B9", item.rate_per_plate, "/plate"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "font-medium", children: [billingPax, " pax"] }), _jsxs("p", { className: "text-lg font-bold text-purple-700", children: ["\u20B9", mealTotal.toLocaleString()] })] })] }, item.id));
                                                }) })] }), _jsx("div", { className: "bg-gray-100 p-4 rounded-lg", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-lg font-bold text-gray-800", children: [hotel.name, " SUBTOTAL"] }), _jsxs("span", { className: "text-2xl font-bold text-green-700", children: ["\u20B9", subtotal.toLocaleString()] })] }) })] })] }, hotel.id));
                }) })] }));
}
