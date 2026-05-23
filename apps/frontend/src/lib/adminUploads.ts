import { supabase } from './supabase'

const STORAGE_BUCKET = 'portfolio-assets'

function getFileExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  return extension && extension.length <= 5 ? extension : 'png'
}

function getUploadPath(folder: string, file: File) {
  const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${folder}/${id}.${getFileExtension(file)}`
}

export async function uploadAdminImage(file: File, folder: 'portfolio' | 'proofs') {
  if (!supabase) {
    throw new Error('Supabase is not configured yet.')
  }

  const path = getUploadPath(folder, file)
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
