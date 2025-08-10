import { supabase } from '../lib/supabase'

const CONTENT_BUCKET = 'content-files'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/ogg',
]

export class StorageService {
  static async uploadFile(
    file: File,
    companyId: string,
    folder: 'images' | 'videos' = 'images'
  ): Promise<{ url?: string; error?: Error }> {
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 50MB limit')
      }

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        throw new Error('File type not supported')
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${companyId}/${folder}/${fileName}`

      // Upload file
      const { data, error } = await supabase.storage
        .from(CONTENT_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(CONTENT_BUCKET)
        .getPublicUrl(data.path)

      return { url: urlData.publicUrl }
    } catch (error) {
      return { error: error as Error }
    }
  }

  static async deleteFile(path: string): Promise<{ error?: Error }> {
    try {
      const { error } = await supabase.storage
        .from(CONTENT_BUCKET)
        .remove([path])

      if (error) throw error

      return {}
    } catch (error) {
      return { error: error as Error }
    }
  }

  static async createSignedUrl(
    path: string,
    expiresIn: number = 3600
  ): Promise<{ url?: string; error?: Error }> {
    try {
      const { data, error } = await supabase.storage
        .from(CONTENT_BUCKET)
        .createSignedUrl(path, expiresIn)

      if (error) throw error

      return { url: data.signedUrl }
    } catch (error) {
      return { error: error as Error }
    }
  }

  static async ensureBucketExists(): Promise<{ error?: Error }> {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      
      if (listError) throw listError

      const bucketExists = buckets?.some(bucket => bucket.name === CONTENT_BUCKET)

      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket(CONTENT_BUCKET, {
          public: false,
          allowedMimeTypes: ALLOWED_MIME_TYPES,
          fileSizeLimit: MAX_FILE_SIZE,
        })

        if (createError) throw createError
      }

      return {}
    } catch (error) {
      return { error: error as Error }
    }
  }
}