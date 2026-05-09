import { createId } from './ids'

export type Notice = {
  id: string
  message: string
  tone: 'success' | 'error' | 'info'
  title: string
}

export const createNotice = (notice: Omit<Notice, 'id'>): Notice => ({
  ...notice,
  id: createId('notice'),
})

export const messageFromError = (caught: unknown, fallback: string) =>
  caught instanceof Error ? caught.message : fallback
