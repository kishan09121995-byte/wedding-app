import { create } from 'zustand';
export const useGuestStore = create((set, get) => ({
    guests: [],
    filters: {},
    selectedGuestId: null,
    setGuests: (guests) => set({ guests }),
    addGuest: (guest) => set((state) => ({ guests: [...state.guests, guest] })),
    updateGuest: (id, updates) => set((state) => ({
        guests: state.guests.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
    deleteGuest: (id) => set((state) => ({
        guests: state.guests.filter((g) => g.id !== id),
    })),
    setFilters: (filters) => set({ filters }),
    setSelectedGuestId: (id) => set({ selectedGuestId: id }),
    getFilteredGuests: () => {
        const { guests, filters } = get();
        return guests.filter((guest) => {
            if (filters.side && guest.side !== filters.side)
                return false;
            if (filters.rsvp_status && guest.rsvp_status !== filters.rsvp_status)
                return false;
            if (filters.hotel_id && guest.hotel_id !== filters.hotel_id)
                return false;
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                return guest.name.toLowerCase().includes(term) || guest.city?.toLowerCase().includes(term);
            }
            return true;
        });
    },
    getTotalPax: () => {
        const { guests } = get();
        return guests.reduce((sum, g) => sum + g.pax_total, 0);
    },
    getConfirmedPax: () => {
        const { guests } = get();
        return guests.reduce((sum, g) => (g.rsvp_status === 'Confirmed' ? sum + g.pax_total : sum), 0);
    },
    getConfirmedByFunction: (fn) => {
        const { guests } = get();
        const fnKey = fn;
        return guests.reduce((sum, g) => {
            if (g.rsvp_status === 'Confirmed' && g[fnKey] === 'Yes') {
                return sum + g.pax_total;
            }
            return sum;
        }, 0);
    },
    getJainPaxByFunction: (fn) => {
        const { guests } = get();
        const fnKey = fn;
        return guests.reduce((sum, g) => {
            if (g.rsvp_status === 'Confirmed' && g[fnKey] === 'Yes') {
                return sum + g.jain_pax;
            }
            return sum;
        }, 0);
    },
    getRoomCount: () => {
        const { guests } = get();
        return guests.filter((g) => g.room_needed === 'Yes').length;
    },
}));
