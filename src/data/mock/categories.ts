import type { ApiCategory } from '@/services/api/api.types'

export const categories: ApiCategory[] = [
  {
    id: 'ai',
    slug: 'ai',
    index: '01',
    name: 'AI & Tools',
    description: 'AI utilities and text processing.',
    icon: 'ai',
  },
  {
    id: 'downloader',
    slug: 'downloader',
    index: '02',
    name: 'Downloader',
    description: 'Media downloader and converters.',
    icon: 'download',
  },
  {
    id: 'search',
    slug: 'search',
    index: '03',
    name: 'Search',
    description: 'Search utilities and more.',
    icon: 'search',
  },
  {
    id: 'image',
    slug: 'image',
    index: '04',
    name: 'Image',
    description: 'Image processing and editing.',
    icon: 'image',
  },
  {
    id: 'whatsapp',
    slug: 'whatsapp',
    index: '05',
    name: 'WhatsApp',
    description: 'WhatsApp utilities and more.',
    icon: 'whatsapp',
  },
  {
    id: 'information',
    slug: 'information',
    index: '06',
    name: 'Information',
    description: 'General information and data.',
    icon: 'information',
  },
]
