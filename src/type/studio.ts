export type StudioImage = {
  url: string;
  filename?: string;
};

export type StudioForm = {
  title: string;
  category: string;
  hourlyRate: string;
  deposit: string;
  capacity: string;
  location: string;
  description: string;
  hostName: string;
  hostEmail: string;
  amenities: string[];
  images: StudioImage[];
};

export type StudioRecord = StudioForm & {
  _id: string;
};