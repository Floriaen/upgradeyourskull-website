export interface Platform {
  name: string;
  url: string;
}

export interface Comment {
  source: string;
  url: string;
  comment: string;
}

export interface Game {
  name: string;
  banner?: string;
  url?: string;
  oldUrl?: string;
  targetUrl?: string;
  description?: string;
  comment?: string;
  contest?: string;
  platforms?: Platform[];
  sources?: Platform[];
  comments?: Comment[];
}
