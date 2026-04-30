import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { Upload, Trash2, Plus, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import * as XLSX from 'xlsx'

interface MenuItem {
  id?: string
  name: string
  category: string
  price?: number
  timing?: string
  gm_name?: string
  selected?: boolean
}

interface MenuFunction {
  function_id: number
  function_name: string
  items: MenuItem[]
  selected_count: number
  notes: string
}

interface MenuData {
  id?: string
  function_id: number
  category: string
  items: MenuItem[]
  quantity: number
  approved: boolean
  created_at?: string
  timing?: string
  gm_name?: string
}

export default function MenuManagement() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [menus, setMenus] = useState<MenuData[]>([])
  const [functions, setFunctions] = useState<any[]>([])
  const [selectedFunction, setSelectedFunction] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [menuCategory, setMenuCategory] = useState('Silver')
  const [menuItems, setMenuItems] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [menuTiming, setMenuTiming] = useState<string>('')
  const [gmName, setGmName] = useState<string>('')
  const [selectedItems, setSelectedItems] = useState<{ [menuId: string]: Set<number> }>({})

  const categories = ['Silver', 'Gold', 'Platinum', 'Diamond']
  const timings = ['8:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM', '10:00 PM']

  useEffect(() => {
    if (!user) {
      navigate('/')
    } else {
      loadData()
    }
  }, [user, navigate])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: functionsData } = await supabase
        .from('functions')
        .select('*')
        .order('id')

      const { data: menusData } = await supabase
        .from('menus')
        .select('*')
        .order('function_id, category')

      setFunctions(functionsData || [])
      setMenus(menusData || [])
      setSelectedItems({})
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load menu data')
    } finally {
      setLoading(false)
    }
  }

  const checkDuplicates = (itemName: string, category: string): boolean => {
    return menus
      .filter(m => m.function_id === selectedFunction && m.category === category)
      .some(m => m.items?.some(item => item.name.toLowerCase() === itemName.toLowerCase()))
  }

  const toggleItemSelection = (menuId: string, itemIndex: number) => {
    setSelectedItems(prev => {
      const current = prev[menuId] || new Set<number>()
      const updated = new Set(current)
      if (updated.has(itemIndex)) {
        updated.delete(itemIndex)
      } else {
        updated.add(itemIndex)
      }
      return { ...prev, [menuId]: updated }
    })
  }

  const getSelectedCount = (menuId: string, total: number): number => {
    return selectedItems[menuId]?.size || 0
  }

  const exportToExcel = () => {
    const functionMenus = menus.filter(m => m.function_id === selectedFunction)
    const exportData = functionMenus.flatMap(menu =>
      menu.items?.map((item, idx) => ({
        Function: currentFunction?.name || `Function ${selectedFunction}`,
        Category: menu.category,
        'Item Name': item.name,
        Timing: menu.timing || '',
        'General Manager': menu.gm_name || '',
        Selected: selectedItems[menu.id!]?.has(idx) ? 'Yes' : 'No',
        'Selected Count': `${getSelectedCount(menu.id!, menu.items?.length || 0)} / ${menu.items?.length || 0}`
      })) || []
    )

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Menu Items')
    XLSX.writeFile(wb, `menu-${selectedFunction}-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Menu exported to Excel')
  }

  const handleAddMenu = async () => {
    if (!menuItems.trim()) {
      toast.error('Please enter menu items')
      return
    }

    try {
      setUploading(true)
      const itemNames = menuItems.split('\n').filter(item => item.trim())

      // Check for duplicates
      const duplicates = itemNames.filter(name => checkDuplicates(name, menuCategory))
      if (duplicates.length > 0) {
        toast.error(`⚠️ Duplicate items found: ${duplicates.join(', ')}`)
        return
      }

      const items = itemNames.map(item => ({
        name: item.trim(),
        category: menuCategory,
        price: 0,
        timing: menuTiming,
        gm_name: gmName
      }))

      const newMenu = {
        function_id: selectedFunction,
        category: menuCategory,
        items: items,
        quantity: quantity,
        approved: false,
        timing: menuTiming,
        gm_name: gmName
      }

      const { error } = await supabase
        .from('menus')
        .insert([newMenu])

      if (error) throw error

      toast.success(`Added ${items.length} items to ${menuCategory} menu`)
      setMenuItems('')
      setQuantity(1)
      setMenuTiming('')
      setGmName('')
      setShowAddMenu(false)
      loadData()
    } catch (error) {
      console.error('Error adding menu:', error)
      toast.error('Failed to add menu items')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMenu = async (menuId: string) => {
    if (!window.confirm('Delete this menu?')) return

    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', menuId)

      if (error) throw error

      toast.success('Menu deleted')
      loadData()
    } catch (error) {
      console.error('Error deleting menu:', error)
      toast.error('Failed to delete menu')
    }
  }

  const handleApprove = async (menuId: string) => {
    try {
      const { error } = await supabase
        .from('menus')
        .update({ approved: true })
        .eq('id', menuId)

      if (error) throw error

      toast.success('Menu approved')
      loadData()
    } catch (error) {
      console.error('Error approving menu:', error)
      toast.error('Failed to approve menu')
    }
  }

  const functionMenus = menus.filter(m => m.function_id === selectedFunction)
  const currentFunction = functions.find(f => f.id === selectedFunction)

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-gray-600">Loading menus...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-rose-gold" />
          <h1 className="text-3xl font-bold text-mauve">Menu Management</h1>
        </div>
        <p className="text-gray-600">Manage wedding menu items by function and category</p>
      </div>

      {/* Function Selector */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Function</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {functions.map((func) => (
            <button
              key={func.id}
              onClick={() => setSelectedFunction(func.id)}
              className={`p-4 rounded-lg font-medium transition ${
                selectedFunction === func.id
                  ? 'bg-rose-gold text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {func.name || `Function ${func.id}`}
            </button>
          ))}
        </div>
      </div>

      {/* Add Menu Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="bg-rose-gold hover:bg-rose-gold/90 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add Menu Items
        </button>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition"
        >
          <Download className="w-5 h-5" />
          Export to Excel
        </button>
      </div>

      {/* Add Menu Form */}
      {showAddMenu && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Add Menu Items</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={menuCategory}
                onChange={(e) => setMenuCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timing
              </label>
              <select
                value={menuTiming}
                onChange={(e) => setMenuTiming(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              >
                <option value="">Select Timing</option>
                {timings.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                General Manager
              </label>
              <input
                type="text"
                value={gmName}
                onChange={(e) => setGmName(e.target.value)}
                placeholder="GM Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items to Select
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min={1}
                max={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Items (one per line)
            </label>
            <textarea
              value={menuItems}
              onChange={(e) => setMenuItems(e.target.value)}
              placeholder="e.g.&#10;Paneer Tikka&#10;Tandoori Chicken&#10;Vegetable Biryani"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-gold outline-none"
              rows={6}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddMenu}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {uploading ? 'Adding...' : 'Add Items'}
            </button>
            <button
              onClick={() => setShowAddMenu(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Current Menus */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {currentFunction?.name || 'Function'} Menus
        </h2>

        {functionMenus.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No menus added yet</p>
        ) : (
          <div className="space-y-4">
            {functionMenus.map((menu) => (
              <div
                key={menu.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {menu.category} Menu
                      </h3>
                      {menu.approved ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Approved
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {menu.items?.length || 0} items • Select {menu.quantity} items
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {!menu.approved && (
                      <button
                        onClick={() => menu.id && handleApprove(menu.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => menu.id && handleDeleteMenu(menu.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Menu Items List with Selection */}
                {menu.items && menu.items.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-700">Items ({getSelectedCount(menu.id!, menu.items.length)} of {menu.items.length} selected):</p>
                      {menu.timing && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{menu.timing}</span>}
                      {menu.gm_name && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">GM: {menu.gm_name}</span>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {menu.items.map((item, idx) => {
                        const isSelected = selectedItems[menu.id!]?.has(idx)
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleItemSelection(menu.id!, idx)}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                              isSelected
                                ? 'bg-green-100 border-green-500 text-green-900'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleItemSelection(menu.id!, idx)}
                                className="w-4 h-4 cursor-pointer"
                              />
                              <span className="text-sm font-medium flex-1">{item.name}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Menu Summary by Category */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const categoryMenus = functionMenus.filter(m => m.category === category)
            const totalItems = categoryMenus.reduce((sum, m) => sum + (m.items?.length || 0), 0)

            return (
              <div key={category} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-600">{category}</p>
                <p className="text-2xl font-bold text-rose-gold">{categoryMenus.length}</p>
                <p className="text-xs text-gray-500">{totalItems} items</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
