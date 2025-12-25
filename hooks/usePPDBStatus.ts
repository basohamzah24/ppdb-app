// Hook untuk mengambil status PPDB
import { useState, useEffect } from 'react'

interface PPDBStatus {
  isOpen: boolean
  tahunAjaran: string
  tanggalTutup: Date | null
  isLoading: boolean
}

export function usePPDBStatus(): PPDBStatus {
  const [status, setStatus] = useState<PPDBStatus>({
    isOpen: false,
    tahunAjaran: '',
    tanggalTutup: null,
    isLoading: true
  })

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/public/data', {
          cache: 'no-store'
        })
        const result = await response.json()
        
        if (result.success && result.data.ppdb) {
          const ppdb = result.data.ppdb
          const isOpen = ppdb.statusPendaftaran === 'buka'
          
          setStatus({
            isOpen,
            tahunAjaran: ppdb.tahunAjaran,
            tanggalTutup: ppdb.tanggalTutup ? new Date(ppdb.tanggalTutup) : null,
            isLoading: false
          })
        } else {
          setStatus(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Error fetching PPDB status:', error)
        setStatus(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchStatus()
  }, [])

  return status
}