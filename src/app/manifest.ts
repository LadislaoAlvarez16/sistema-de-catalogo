import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Panel de Gestión',
    short_name: 'Panel',
    description: 'Gestioná tu catálogo online',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#111827', // Un tono oscuro, gris 900
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
