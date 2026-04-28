import { create } from 'zustand'

export interface Guest {
  id: string
  name: string
  city?: string
  pax_total: number
  side: 'Bride' | 'Groom'
  rsvp_status: 'Confirmed' | 'Not Decided' | 'Declined'
  jain_pax: number
  f1: 'Yes' | 'No' | 'TBD'
  f2: 'Yes' | 'No' | 'TBD'
  f3: 'Yes' | 'No' | 'TBD'
  f4: 'Yes' | 'No' | 'TBD'
  room_needed: 'Yes' | 'No'
  hotel_id?: string
  room_category?: string
  check_in?: string
  check_out?: string
  room_number?: string
  notes?: string
  qr_token?: string
}

interface GuestFilters {
  side?: 'Bride' | 'Groom'
  rsvp_status?: 'Confirmed' | 'Not Decided' | 'Declined'
  hotel_id?: string
  searchTerm?: string
}

interface GuestState {
  guests: Guest[]
  filters: GuestFilters
  selectedGuestId: string | null

  setGuests: (guests: Guest[]) => void
  addGuest: (guest: Guest) => void
  updateGuest: (id: string, updates: Partial<Guest>) => void
  deleteGuest: (id: string) => void
  setFilters: (filters: GuestFilters) => void
  setSelectedGuestId: (id: string | null) => void

  // Computed values
  getFilteredGuests: () => Guest[]
  getTotalPax: () => number
  getConfirmedPax: () => number
  getConfirmedByFunction: (fn: 'f1' | 'f2' | 'f3' | 'f4') => number
  getJainPaxByFunction: (fn: 'f1' | 'f2' | 'f3' | 'f4') => number
  getRoomCount: () => number
}

export const useGuestStore = create<GuestState>((set, get) => ({
  guests: [],
  filters: {},
  selectedGuestId: null,

  setGuests: (guests) => set({ guests }),
  addGuest: (guest) => set((state) => ({ guests: [...state.guests, guest] })),
  updateGuest: (id, updates) =>
    set((state) => ({
      guests: state.guests.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    })),
  deleteGuest: (id) =>
    set((state) => ({
      guests: state.guests.filter((g) => g.id !== id),
    })),
  setFilters: (filters) => set({ filters }),
  setSelectedGuestId: (id) => set({ selectedGuestId: id }),

  getFilteredGuests: () => {
    const { guests, filters } = get()
    return guests.filter((guest) => {
      if (filters.side && guest.side !== filters.side) return false
      if (filters.rsvp_status && guest.rsvp_status !== filters.rsvp_status) return false
      if (filters.hotel_id && guest.hotel_id !== filters.hotel_id) return false
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase()
        return guest.name.toLowerCase().includes(term) || guest.city?.toLowerCase().includes(term)
      }
      return true
    })
  },

  getTotalPax: () => {
    const { guests } = get()
    return guests.reduce((sum, g) => sum + g.pax_total, 0)
  },

  getConfirmedPax: () => {
    const { guests } = get()
    return guests.reduce((sum, g) => (g.rsvp_status === 'Confirmed' ? sum + g.pax_total : sum), 0)
  },

  getConfirmedByFunction: (fn) => {
    const { guests } = get()
    const fnKey = fn as keyof Guest
    return guests.reduce((sum, g) => {
      if (g.rsvp_status === 'Confirmed' && g[fnKey] === 'Yes') {
        return sum + g.pax_total
      }
      return sum
    }, 0)
  },

  getJainPaxByFunction: (fn) => {
    const { guests } = get()
    const fnKey = fn as keyof Guest
    return guests.reduce((sum, g) => {
      if (g.rsvp_status === 'Confirmed' && g[fnKey] === 'Yes') {
        return sum + g.jain_pax
      }
      return sum
    }, 0)
  },

  getRoomCount: () => {
    const { guests } = get()
    return guests.filter((g) => g.room_needed === 'Yes').length
  },
}))
