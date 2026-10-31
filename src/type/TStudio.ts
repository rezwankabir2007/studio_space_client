interface Studio {
  _id: string;
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
  images: {
    filename: string;
    url: string;
  }[];
}