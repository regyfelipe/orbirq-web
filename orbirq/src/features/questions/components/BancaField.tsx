import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Banca {
  id: string
  nome: string
}

interface BancaFieldProps {
  questao: {
    banca: string
  }
  updateQuestao: (field: 'banca', value: string) => void
}

export default function BancaField({ questao, updateQuestao }: BancaFieldProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(questao.banca || '')
  const [suggestions, setSuggestions] = useState<Banca[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBanca, setSelectedBanca] = useState<Banca | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync input value with questao.banca
  useEffect(() => {
    setInputValue(questao.banca || '')
  }, [questao.banca])

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

  // Search bancas from backend
  const searchBancas = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/bancas?search=${encodeURIComponent(searchTerm)}`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error searching bancas:', error)
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
      searchBancas(inputValue)
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue])

  const handleSelect = (banca: Banca) => {
    setSelectedBanca(banca)
    setInputValue(banca.nome)
    updateQuestao('banca', banca.nome)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setSelectedBanca(null) // Reset selection when user types
    if (!value.trim()) {
      updateQuestao('banca', '')
    }
  }

  const handleInputBlur = () => {
    // If user typed something that doesn't match any suggestion, update the questao
    if (inputValue.trim() && !selectedBanca) {
      updateQuestao('banca', inputValue.trim())
    }
  }

  const filteredSuggestions = suggestions.filter(banca =>
    banca.nome.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label htmlFor="banca">Banca</Label>
      <div className="relative">
        <Input
          id="banca"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setOpen(true)}
          placeholder="Digite ou selecione uma banca..."
          className="pr-10"
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
              {filteredSuggestions.map((banca) => (
                <button
                  key={banca.id}
                  type="button"
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center",
                    selectedBanca?.id === banca.id && "bg-blue-50"
                  )}
                  onClick={() => handleSelect(banca)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedBanca?.id === banca.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {banca.nome}
                </button>
              ))}
            </div>
          ) : inputValue ? (
            <div className="py-4 px-3 text-center">
              <p className="text-sm text-gray-500 mb-2">Nenhuma banca encontrada.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  updateQuestao('banca', inputValue.trim())
                  setOpen(false)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar "{inputValue}"
              </Button>
            </div>
          ) : (
            <div className="py-6 px-3 text-center text-sm text-gray-500">
              Digite para buscar bancas...
            </div>
          )}
        </div>
      )}
    </div>
  )
}