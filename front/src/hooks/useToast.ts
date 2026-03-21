/**
 * Hook de toast — sistema de notificações
 * Baseado no padrão Radix UI Toast
 */
import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 4000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type ActionType =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

let count = 0
function genId() { return String(++count) }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

function reducer(state: ToasterToast[], action: ActionType): ToasterToast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [action.toast, ...state].slice(0, TOAST_LIMIT)
    case "UPDATE_TOAST":
      return state.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t)
    case "DISMISS_TOAST": {
      if (action.toastId) addToRemoveQueue(action.toastId)
      else state.forEach(t => addToRemoveQueue(t.id))
      return state.map(t =>
        !action.toastId || t.id === action.toastId ? { ...t, open: false } : t
      )
    }
    case "REMOVE_TOAST":
      return action.toastId ? state.filter(t => t.id !== action.toastId) : []
  }
}

const listeners: Array<(state: ToasterToast[]) => void> = []
let memoryState: ToasterToast[] = []

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(l => l(memoryState))
}

function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()
  const update = (p: Partial<ToasterToast>) => dispatch({ type: "UPDATE_TOAST", toast: { ...p, id } })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
  dispatch({ type: "ADD_TOAST", toast: { ...props, id, open: true, onOpenChange: o => { if (!o) dismiss() } } })
  return { id, dismiss, update }
}

export function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1) }
  }, [])
  return {
    toasts: state,
    toast,
    dismiss: (id?: string) => dispatch({ type: "DISMISS_TOAST", toastId: id }),
  }
}

export { toast }
