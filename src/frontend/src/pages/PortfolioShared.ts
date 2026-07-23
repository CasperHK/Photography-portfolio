export type Exif = {
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  focalLength: string;
  location: string;
};

export type Photo = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  sortOrder: number;
  exif?: Exif;
};

export type GalleryInfo = {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  summary: string;
  notes: string[];
};

type DemoCopy = {
  title: (index: number) => string;
  description: string;
};

export const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";
export const MEDIA_BASE =
  (import.meta as any).env?.VITE_MEDIA_BASE_URL ?? "http://localhost:8080";
export const ADMIN_LOGIN_URL =
  (import.meta as any).env?.VITE_ADMIN_LOGIN_URL ?? `${API_BASE}/admin/login`;
export const FORCE_DEMO_PHOTOS_BY_ENV =
  (import.meta as any).env?.VITE_FORCE_DEMO_PHOTOS === "true";

const DEMO_TILE_SIZES: Array<[number, number]> = [
  [1200, 780],
  [780, 1200],
  [1400, 900],
  [900, 1400],
  [1280, 860],
  [860, 1280],
  [1500, 980],
  [980, 1500],
];

const DEMO_EXIF_PRESETS: Exif[] = [
  {
    camera: "Fujifilm X-T5",
    lens: "XF 35mm f/1.4",
    aperture: "f/2.0",
    shutterSpeed: "1/250",
    iso: 320,
    focalLength: "35mm",
    location: "Kowloon, Hong Kong",
  },
  {
    camera: "Sony A7 IV",
    lens: "FE 24-70mm f/2.8 GM",
    aperture: "f/4.0",
    shutterSpeed: "1/640",
    iso: 100,
    focalLength: "24mm",
    location: "Lantau Island",
  },
  {
    camera: "Nikon Zf",
    lens: "NIKKOR Z 50mm f/1.8",
    aperture: "f/1.8",
    shutterSpeed: "1/125",
    iso: 640,
    focalLength: "50mm",
    location: "Mong Kok",
  },
  {
    camera: "Canon EOS R6",
    lens: "RF 70-200mm f/4",
    aperture: "f/5.6",
    shutterSpeed: "1/500",
    iso: 200,
    focalLength: "112mm",
    location: "Victoria Harbour",
  },
];

const DEFAULT_DEMO_COPY: DemoCopy = {
  title: (index) => `Demo ${index + 1}`,
  description: "A captured moment balancing texture, movement, and available light.",
};

export const createDemoPhotos = (count = 30, copy: DemoCopy = DEFAULT_DEMO_COPY): Photo[] => {
  return Array.from({ length: count }, (_, i) => {
    const [w, h] = DEMO_TILE_SIZES[i % DEMO_TILE_SIZES.length];
    const seed = `portfolio-${i + 1}`;
    const exif = DEMO_EXIF_PRESETS[i % DEMO_EXIF_PRESETS.length];

    return {
      id: 10000 + i,
      title: copy.title(i),
      description: copy.description,
      fileUrl: `https://picsum.photos/seed/${seed}/${w * 2}/${h * 2}`,
      thumbUrl: `https://picsum.photos/seed/${seed}/${w}/${h}`,
      width: w,
      height: h,
      sortOrder: i,
      exif,
    };
  });
};

export const loadPortfolioPhotos = async (
  count = 30,
  copy: DemoCopy = DEFAULT_DEMO_COPY,
): Promise<Photo[]> => {
  try {
    const res = await fetch(`${API_BASE}/albums/portfolio/photos`);

    if (!res.ok) {
      return createDemoPhotos(count, copy);
    }

    const data = await res.json();
    const fetched = Array.isArray(data.photos) ? data.photos : [];

    return fetched.length ? fetched : createDemoPhotos(count, copy);
  } catch {
    return createDemoPhotos(count, copy);
  }
};

export const toMediaUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${MEDIA_BASE}${path}`;

export type ExifEntry = {
  label: string;
  value: string;
};

export type ExifLabels = {
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  focalLength: string;
  location: string;
};

const DEFAULT_EXIF_LABELS: ExifLabels = {
  camera: "Camera",
  lens: "Lens",
  aperture: "Aperture",
  shutterSpeed: "Shutter Speed",
  iso: "ISO",
  focalLength: "Focal Length",
  location: "Location",
};

export const getPhotoExifEntries = (
  exif?: Partial<Exif>,
  labels: ExifLabels = DEFAULT_EXIF_LABELS,
): ExifEntry[] => {
  if (!exif) return [];

  const entries: Array<ExifEntry | null> = [
    exif.camera ? { label: labels.camera, value: exif.camera } : null,
    exif.lens ? { label: labels.lens, value: exif.lens } : null,
    exif.aperture ? { label: labels.aperture, value: exif.aperture } : null,
    exif.shutterSpeed ? { label: labels.shutterSpeed, value: `${exif.shutterSpeed}s` } : null,
    exif.iso ? { label: labels.iso, value: String(exif.iso) } : null,
    exif.focalLength ? { label: labels.focalLength, value: exif.focalLength } : null,
    exif.location ? { label: labels.location, value: exif.location } : null,
  ];

  return entries.filter((entry): entry is ExifEntry => entry !== null);
};

export const PAGE_LOAD_MOTION = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.28, easing: [0.22, 1, 0.36, 1] },
} as const;

export const prefersReducedMotion = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const getPageLoadMotion = () => {
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }

  return PAGE_LOAD_MOTION;
};
