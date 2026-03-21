import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata data longa (ex: "19 de outubro de 2026") */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Formata data curta (ex: "19/10/2026") */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

/** Formata hora para HH:mm */
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Formata horas decimais para "Xh Ym" */
export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/** Extrai a data de um DateTime para usar em <input type="date"> */
export function toDateInputValue(date: string | Date): string {
  return new Date(date).toISOString().split("T")[0];
}

/** Extrai o horário de um DateTime para usar em <input type="time"> */
export function toTimeInputValue(date: string | Date): string {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Gera initials de um nome (ex: "João Silva" → "JS") */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

// ─── Labels de enums ──────────────────────────────────────────────────────────

export const activityTypeLabels: Record<string, string> = {
  TALK: "Palestra",
  WORKSHOP: "Workshop",
  PANEL: "Mesa Redonda",
  KEYNOTE: "Keynote",
  COFFEE_BREAK: "Coffee Break",
  OTHER: "Outro",
};

export const activityTypeIcons: Record<string, string> = {
  TALK: "🎤",
  WORKSHOP: "🛠️",
  PANEL: "🎙️",
  KEYNOTE: "⭐",
  COFFEE_BREAK: "☕",
  OTHER: "📌",
};

export const activityLevelLabels: Record<string, string> = {
  BEGINNER: "Iniciante",
  INTERMEDIATE: "Intermediário",
  ADVANCED: "Avançado",
};

export const activityLevelColors: Record<string, string> = {
  BEGINNER: "text-green-600 bg-green-50 dark:bg-green-900/20",
  INTERMEDIATE: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
  ADVANCED: "text-red-600 bg-red-50 dark:bg-red-900/20",
};

export const speakerRoleLabels: Record<string, string> = {
  SPEAKER: "Palestrante",
  MODERATOR: "Moderador",
  PANELIST: "Panelista",
};

export const certTypeLabels: Record<string, string> = {
  PARTICIPATION: "Participação",
  SPEAKER: "Palestrante",
  COORDINATOR: "Coordenador",
  ORGANIZER: "Organizador",
};

export const sponsorTierLabels: Record<string, string> = {
  DIAMOND: "Diamante",
  GOLD: "Ouro",
  SILVER: "Prata",
  BRONZE: "Bronze",
  SUPPORTER: "Apoiador",
};

export const standCategoryLabels: Record<string, string> = {
  COMPANY: "Empresa",
  UNIVERSITY: "Universidade",
  OPEN_SOURCE: "Open Source",
  GOVERNMENT: "Governo",
  OTHER: "Outro",
};

export const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  COORDINATOR: "Coordenador",
  MEMBER: "Membro",
};

export const registrationStatusLabels: Record<string, string> = {
  CONFIRMED: "Confirmado",
  PENDING: "Pendente",
  CANCELLED: "Cancelado",
  WAITLIST: "Lista de espera",
};
