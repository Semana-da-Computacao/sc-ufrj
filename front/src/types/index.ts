/**
 * Tipos globais do sistema de administração SC-UFRJ
 */

export type Role = "ADMIN" | "COORDINATOR" | "MEMBER";
export type ActivityType = "TALK" | "WORKSHOP" | "PANEL" | "KEYNOTE" | "COFFEE_BREAK" | "OTHER";
export type CertType = "PARTICIPATION" | "SPEAKER" | "COORDINATOR" | "ORGANIZER";
export type SponsorTier = "DIAMOND" | "GOLD" | "SILVER" | "BRONZE" | "SUPPORTER";
export type StandCategory = "COMPANY" | "UNIVERSITY" | "OPEN_SOURCE" | "GOVERNMENT" | "OTHER";
export type SpeakerRole = "SPEAKER" | "MODERATOR" | "PANELIST";
export type RegistrationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "WAITLIST";
export type ActivityLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  qrCodeToken: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ─── Palestrantes ─────────────────────────────────────────────────────────────

export interface Speaker {
  id: string;
  eventId: string;
  name: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  confirmedAt?: string;
  createdAt: string;
  activities?: ActivitySpeakerLink[];
}

export interface ActivitySpeakerLink {
  id: string;
  activityId: string;
  speakerId: string;
  role: SpeakerRole;
  speaker?: Pick<Speaker, "id" | "name" | "title" | "photoUrl">;
  activity?: Pick<Activity, "id" | "title" | "type">;
}

// ─── Stands ───────────────────────────────────────────────────────────────────

export interface Stand {
  id: string;
  eventId: string;
  name: string;
  company?: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  category: StandCategory;
  standNumber?: string;
  location?: string;
  order: number;
  createdAt: string;
}

// ─── Eventos ──────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  slug: string;
  name: string;
  description?: string;
  year: number;
  edition?: number;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  bannerUrl?: string;
  location?: string;
  maxCapacity?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
  days?: EventDay[];
  speakers?: Speaker[];
  stands?: Stand[];
  sponsors?: Sponsor[];
  coordinators?: EventCoordinator[];
  certificateTemplates?: CertificateTemplate[];
  _count?: {
    registrations: number;
    days: number;
    speakers: number;
    stands: number;
  };
}

export interface EventDay {
  id: string;
  eventId: string;
  date: string;
  label?: string;
  order: number;
  activities?: Activity[];
  locations?: EventLocation[];
}

export interface EventLocation {
  id: string;
  name: string;
  capacity?: number;
  description?: string;
  building?: string;
  floor?: string;
  eventDayId: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  type: ActivityType;
  startTime: string;
  endTime: string;
  durationHours?: number;
  maxAttendees?: number;
  streamUrl?: string;
  level?: ActivityLevel;
  tags?: string; // JSON serializado
  eventDayId: string;
  locationId?: string;
  location?: EventLocation;
  attendances?: ActivitySpeakerLink[]; // palestrantes da atividade
}

export interface EventCoordinator {
  id: string;
  userId: string;
  eventId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

// ─── Usuários ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  cpf?: string;
  phone?: string;
  institution?: string;
  isActive: boolean;
  qrCodeToken: string;
  avatarUrl?: string;
  createdAt: string;
  _count?: { registrations: number; certificates: number };
}

// ─── Inscrições ───────────────────────────────────────────────────────────────

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  status: RegistrationStatus;
  user?: Pick<User, "id" | "name" | "email" | "institution" | "qrCodeToken" | "phone">;
}

// ─── Presenças ────────────────────────────────────────────────────────────────

export interface Attendance {
  id: string;
  userId: string;
  activityId: string;
  checkedAt: string;
  checkedBy?: string;
  user?: Pick<User, "id" | "name" | "email" | "institution">;
  activity?: Pick<Activity, "id" | "title" | "durationHours" | "type">;
}

// ─── Certificados ─────────────────────────────────────────────────────────────

export interface CertificateTemplate {
  id: string;
  name: string;
  eventId: string;
  htmlTemplate: string;
  minHours: number;
  type: CertType;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  eventId: string;
  templateId: string;
  issuedAt: string;
  code: string;
  totalHours: number;
  pdfUrl?: string;
  user?: Pick<User, "id" | "name" | "email">;
  event?: Pick<Event, "id" | "name" | "year" | "slug">;
  template?: Pick<CertificateTemplate, "name" | "type">;
}

// ─── Patrocinadores ───────────────────────────────────────────────────────────

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  tier: SponsorTier;
  eventId: string;
  order: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStats {
  registrations: number;
  attendances: number;
  certificates: number;
  activities: number;
  speakers: number;
  stands: number;
}
