export interface Resource {
  id: string;
  title: string;
  url: string;
  category: 'Design System' | 'References' | 'Platforms' | string;
  tags: string[];
  sourceType: string;
  status: 'Published' | 'Draft';
  thumbnail: string | null;
  tag_line?: string;
  explore_tip?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AirtableThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: AirtableThumbnail;
    large: AirtableThumbnail;
    full: AirtableThumbnail;
  };
}

export type Category = 'Design System' | 'References' | 'Platforms' | 'All';
