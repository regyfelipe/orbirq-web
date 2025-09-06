import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Image as ImageIcon, Link as LinkIcon, X, Plus } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'link'
  url?: string
  file?: File
  preview?: string
  description: string
}

interface MediaUploaderProps {
  updateQuestao: (field: any, value: any) => void
}

export default function MediaUploader({ updateQuestao }: MediaUploaderProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkDescription, setLinkDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          type: 'image',
          file: file,
          preview: e.target?.result as string,
          description: ''
        }
        setMediaItems(prev => [...prev, newItem])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      const newItem: MediaItem = {
        id: Date.now().toString(),
        type: 'link',
        url: linkUrl.trim(),
        description: linkDescription.trim()
      }
      setMediaItems(prev => [...prev, newItem])
      setLinkUrl('')
      setLinkDescription('')
      setShowLinkInput(false)
    }
  }

  const removeMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id))
  }

  const updateDescription = (id: string, description: string) => {
    setMediaItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, description } : item
      )
    )
  }

  // Update questao when media changes
  React.useEffect(() => {
    const imageItem = mediaItems.find(item => item.type === 'image')
    const linkItem = mediaItems.find(item => item.type === 'link')

    if (imageItem) {
      updateQuestao('imagem_url', imageItem.preview || imageItem.url)
      updateQuestao('descricao_imagem', imageItem.description)
    } else if (linkItem) {
      updateQuestao('imagem_url', linkItem.url)
      updateQuestao('descricao_imagem', linkItem.description)
    } else {
      updateQuestao('imagem_url', '')
      updateQuestao('descricao_imagem', '')
    }
  }, [mediaItems, updateQuestao])

  return (
    <div className="space-y-4">
      <Label>Mídia da Questão</Label>

      {/* Media Items Display */}
      {mediaItems.length > 0 && (
        <div className="space-y-3">
          {mediaItems.map((item) => (
            <Card key={item.id} className="p-3">
              <CardContent className="p-0">
                <div className="flex gap-3">
                  {item.type === 'image' && item.preview && (
                    <div className="flex-shrink-0">
                      <img
                        src={item.preview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                  {item.type === 'link' && (
                    <div className="flex-shrink-0 w-20 h-20 bg-blue-50 border rounded flex items-center justify-center">
                      <LinkIcon className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {item.type === 'image' ? 'Imagem' : 'Link'}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMediaItem(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    {item.type === 'link' && item.url && (
                      <p className="text-sm text-blue-600 break-all">{item.url}</p>
                    )}
                    <Textarea
                      placeholder="Descrição da mídia (obrigatório para acessibilidade)"
                      value={item.description}
                      onChange={(e) => updateDescription(item.id, e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Media Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Adicionar Imagem
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="flex-1"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Adicionar Link
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Link Input Form */}
      {showLinkInput && (
        <Card className="p-3">
          <CardContent className="p-0 space-y-3">
            <div>
              <Label htmlFor="linkUrl" className="text-sm">URL do Link</Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://exemplo.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkDescription" className="text-sm">Descrição</Label>
              <Textarea
                id="linkDescription"
                placeholder="Descreva o conteúdo do link"
                value={linkDescription}
                onChange={(e) => setLinkDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddLink}
                disabled={!linkUrl.trim()}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Link
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowLinkInput(false)
                  setLinkUrl('')
                  setLinkDescription('')
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <p className="text-xs text-muted-foreground">
        Adicione imagens ou links relevantes para enriquecer a questão.
        Sempre inclua uma descrição para acessibilidade.
      </p>
    </div>
  )
}