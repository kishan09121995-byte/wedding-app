import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
export function EditableCell({ value, onSave, type = 'text', options = [], disabled = false, }) {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);
    const handleSave = () => {
        if (localValue !== value) {
            onSave(localValue);
        }
        setIsEditing(false);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
        else if (e.key === 'Escape') {
            setLocalValue(value);
            setIsEditing(false);
        }
    };
    if (!isEditing) {
        return (_jsx("div", { onClick: () => !disabled && setIsEditing(true), className: `px-3 py-2 rounded cursor-pointer hover:bg-gray-100 ${disabled ? 'cursor-not-allowed opacity-50' : ''}`, children: type === 'checkbox' ? (_jsx("input", { type: "checkbox", checked: Boolean(value), onChange: (e) => {
                    onSave(e.target.checked);
                }, disabled: disabled, className: "w-4 h-4 cursor-pointer" })) : type === 'date' ? (new Date(value).toLocaleDateString()) : (String(value || '')) }));
    }
    return (_jsx("div", { className: "px-2 py-1", children: type === 'checkbox' ? (_jsx("input", { type: "checkbox", ref: inputRef, checked: Boolean(localValue), onChange: (e) => setLocalValue(e.target.checked), className: "w-4 h-4" })) : type === 'select' ? (_jsxs("select", { ref: inputRef, value: localValue || '', onChange: (e) => setLocalValue(e.target.value), onBlur: handleSave, onKeyDown: handleKeyDown, className: "w-full px-2 py-1 border border-rose-gold rounded text-sm", children: [_jsx("option", { value: "", children: "Select..." }), options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] })) : type === 'date' ? (_jsx("input", { ref: inputRef, type: "date", value: localValue || '', onChange: (e) => setLocalValue(e.target.value), onBlur: handleSave, onKeyDown: handleKeyDown, className: "w-full px-2 py-1 border border-rose-gold rounded text-sm" })) : type === 'number' ? (_jsx("input", { ref: inputRef, type: "number", value: localValue || '', onChange: (e) => setLocalValue(Number(e.target.value)), onBlur: handleSave, onKeyDown: handleKeyDown, className: "w-full px-2 py-1 border border-rose-gold rounded text-sm" })) : (_jsx("input", { ref: inputRef, type: "text", value: localValue || '', onChange: (e) => setLocalValue(e.target.value), onBlur: handleSave, onKeyDown: handleKeyDown, className: "w-full px-2 py-1 border border-rose-gold rounded text-sm" })) }));
}
