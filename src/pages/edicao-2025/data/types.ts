export interface Event2025Session {
  time: string;
  endTime: string;
  title: string;
  type: string;
  speaker: string;
  description: string;
}

export interface Event2025Track {
  name: string;
  sessions: Event2025Session[];
}

export interface Event2025Day {
  id: string;
  day: string;
  dateLabel: string;
  theme: string;
  tracks: Event2025Track[];
}

export interface Event2025Info {
  date: string;
  location: string;
  about: string;
}

export interface Event2025Brand {
  name: string;
  logoUrl: string;
  website?: string;
}

export interface Event2025SponsorTier {
  type: 1 | 2 | 3;
  brands: Event2025Brand[];
}

export interface Event2025Sponsors {
  title: string;
  subtitle?: string;
  tiers: Event2025SponsorTier[];
  partners: Event2025Brand[];
}

export interface Event2025Data {
  eventInfo: Event2025Info;
  sponsors: Event2025Sponsors;
  schedule: Event2025Day[];
}
