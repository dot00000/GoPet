'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from "react"

export default function Providers({ children }: { children: React.ReactNode}) {
    // 단 한번만 초기화
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}