'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase'
import type { Product, ProductCategory } from '@/types'

interface UseProductsOptions {
  category?: ProductCategory
  featured?: boolean
  limit?: number
  searchQuery?: string
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const supabase = createSupabaseBrowserClient()
      let query = supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('is_published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (options.category) query = query.eq('category', options.category)
      if (options.featured) query = query.eq('featured', true)
      if (options.limit) query = query.limit(options.limit)
      if (options.searchQuery) {
        query = query.or(
          `name_id.ilike.%${options.searchQuery}%,name_en.ilike.%${options.searchQuery}%`
        )
      }

      const { data, error: supabaseError } = await query
      if (supabaseError) throw supabaseError
      setProducts(data as Product[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }, [options.category, options.featured, options.limit, options.searchQuery])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, isLoading, error, refetch: fetchProducts }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    const supabase = createSupabaseBrowserClient()
    supabase
      .from('products')
      .select('*, images:product_images(*)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
      .then(({ data, error: supabaseError }) => {
        if (supabaseError) setError(supabaseError.message)
        else setProduct(data as Product)
        setIsLoading(false)
      })
  }, [slug])

  return { product, isLoading, error }
}
