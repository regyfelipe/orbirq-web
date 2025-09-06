import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchItem {
  id: string
  nome: string
}

interface GenericSearchFieldProps {
  label: string
  fieldName: string
  questao: Record<string, any>
  updateQuestao: (field: any, value: any) => void
  apiEndpoint: string
  placeholder?: string
  required?: boolean
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export default function GenericSearchField({
  label,
  fieldName,
  questao,
  updateQuestao,
  apiEndpoint,
  placeholder = "Digite para buscar...",
  required = false
}: GenericSearchFieldProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(questao[fieldName] || '')
  const [suggestions, setSuggestions] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync input value with questao
  useEffect(() => {
    setInputValue(questao[fieldName] || '')
  }, [questao[fieldName], fieldName])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search items from backend
  const searchItems = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/${apiEndpoint}?search=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error(`Error searching ${apiEndpoint}:`, error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchItems(inputValue)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue]) // Removido searchItems das dependências para evitar loop

  const handleSelect = (item: SearchItem) => {
    setSelectedItem(item)
    setInputValue(item.nome)
    updateQuestao(fieldName, item.nome)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setSelectedItem(null) // Reset selection when user types
    if (!value.trim()) {
      updateQuestao(fieldName, '')
    }
  }

  const filteredSuggestions = suggestions.filter(item =>
    item.nome.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label htmlFor={fieldName} className={required ? "text-red-500" : ""}>
        {label} {required && "*"}
      </Label>
      <div className="relative">
        <Input
          id={fieldName}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn(
            "pr-10",
            required && "border-red-200 focus:border-red-400"
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setOpen(!open)}
        >
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Buscando...</span>
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <div className="py-1">
              {filteredSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center",
                    selectedItem?.id === item.id && "bg-blue-50"
                  )}
                  onClick={() => handleSelect(item)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedItem?.id === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.nome}
                </button>
              ))}
            </div>
          ) : inputValue ? (
            <div className="py-4 px-3 text-center">
              <p className="text-sm text-gray-500 mb-2">Nenhum resultado encontrado.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  updateQuestao(fieldName, inputValue.trim())
                  setOpen(false)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar "{inputValue}"
              </Button>
            </div>
          ) : (
            <div className="py-6 px-3 text-center text-sm text-gray-500">
              Digite para buscar...
            </div>
          )}
        </div>
      )}
    </div>
  )
}