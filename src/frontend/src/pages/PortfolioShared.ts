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

export const createDemoPhotos = (count = 30): Photo[] => {
  return Array.from({ length: count }, (_, i) => {
    const [w, h] = DEMO_TILE_SIZES[i % DEMO_TILE_SIZES.length];
    const seed = `portfolio-${i + 1}`;
    const exif = DEMO_EXIF_PRESETS[i % DEMO_EXIF_PRESETS.length];

    return {
      id: 10000 + i,
      title: `Demo ${i + 1}`,
      description: "A captured moment balancing texture, movement, and available light.",
      fileUrl: `https://picsum.photos/seed/${seed}/${w * 2}/${h * 2}`,
      thumbUrl: `https://picsum.photos/seed/${seed}/${w}/${h}`,
      width: w,
      height: h,
      sortOrder: i,
      exif,
    };
  });
};

export const loadPortfolioPhotos = async (count = 30): Promise<Photo[]> => {
  try {
    const res = await fetch(`${API_BASE}/albums/portfolio/photos`);

    if (!res.ok) {
      return createDemoPhotos(count);
    }

    const data = await res.json();
    const fetched = Array.isArray(data.photos) ? data.photos : [];

    return fetched.length ? fetched : createDemoPhotos(count);
  } catch {
    return createDemoPhotos(count);
  }
};

export const toMediaUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${MEDIA_BASE}${path}`;

export const GALLERIES: Record<string, GalleryInfo> = {
  "1": {
    id: "1",
    kicker: "Archive",
    title: "Harbor Light",
    subtitle: "A structured edit with notes, sequencing, and vertical studies.",
    summary:
      "A horizontal edit of field notes, road edges, weather, and passing light.",
    notes: [
      "Travel, street, and landscape work arranged as a moving contact wall.",
      "Use wheel or trackpad to move through the sequence and open a frame for details.",
      "Each frame includes title, description, and available camera metadata.",
    ],
  },
  "2": {
    id: "2",
    kicker: "City",
    title: "Midnight Crossings",
    subtitle: "Neon spill, wet concrete, and brief gestures between trains.",
    summary:
      "A night-street collection built around reflections, compressed movement, and layered signage.",
    notes: [
      "Dense urban frames with long shadows and reflective surfaces.",
      "Built for slower reading, with recurring figures and mirrored storefronts.",
      "Best viewed as a continuous sequence rather than isolated frames.",
    ],
  },
  "3": {
    id: "3",
    kicker: "Terrain",
    title: "Highland Weather",
    subtitle: "Ridges, roadside fog, and changing light over open ground.",
    summary:
      "A landscape edit focused on altitude, low-contrast weather, and quiet horizon studies.",
    notes: [
      "Wider compositions anchored by mist, grass, and distant structures.",
      "Sequencing moves from cold dawn light into flatter afternoon weather.",
      "Includes a mix of broad views and compressed telephoto studies.",
    ],
  },
  "4": {
    id: "4",
    kicker: "Travel",
    title: "Platform Notes",
    subtitle: "Departures, waiting rooms, and overlooked transit rituals.",
    summary:
      "A documentary-style set from stations, ferries, and roadside pauses stitched into one travel diary.",
    notes: [
      "Frames center on routine gestures, bags, tickets, and transitional space.",
      "Color stays restrained to emphasize atmosphere and repetition.",
      "Pairs environmental images with tighter observational details.",
    ],
  },
  "5": {
    id: "5",
    kicker: "Sea Edge",
    title: "Salt and Concrete",
    subtitle: "Breakwaters, harbor walls, and the geometry of the waterfront.",
    summary:
      "An architectural shoreline sequence combining industrial texture with open water and haze.",
    notes: [
      "Built around shape, negative space, and repeated structural lines.",
      "Alternates between minimal wide frames and close surface studies.",
      "Keeps the edit quiet and spare, with emphasis on texture.",
    ],
  },
};

export const getGalleries = () => Object.values(GALLERIES);

export const getGalleryById = (galleryId: string) => GALLERIES[galleryId] ?? null;

export type ExifEntry = {
  label: string;
  value: string;
};

export const getPhotoExifEntries = (exif?: Partial<Exif>): ExifEntry[] => {
  if (!exif) return [];

  const entries: Array<ExifEntry | null> = [
    exif.camera ? { label: "Camera", value: exif.camera } : null,
    exif.lens ? { label: "Lens", value: exif.lens } : null,
    exif.aperture ? { label: "Aperture", value: exif.aperture } : null,
    exif.shutterSpeed ? { label: "Shutter Speed", value: `${exif.shutterSpeed}s` } : null,
    exif.iso ? { label: "ISO", value: String(exif.iso) } : null,
    exif.focalLength ? { label: "Focal Length", value: exif.focalLength } : null,
    exif.location ? { label: "Location", value: exif.location } : null,
  ];

  return entries.filter((entry): entry is ExifEntry => entry !== null);
};

export const ABOUT_PANELS = [
  {
    heading: "Approach",
    text: "I photograph motion, weather, and small city moments to keep the frame honest and tactile.",
  },
  {
    heading: "Timeline",
    text: "This archive moves from early dawn streets to late mountain blue-hour studies across seasons.",
  },
  {
    heading: "Tools",
    text: "A lightweight mirrorless setup, prime lenses, and minimal post processing focused on tone and texture.",
  },
  {
    heading: "Assignments",
    text: "Available for travel editorial, boutique hospitality, and documentary-style brand stories.",
  },
  {
    heading: "Contact",
    text: "For collaboration, share your brief and timeline and I will propose a visual direction and shot plan.",
  },
];

export const GALLERY_NOTES = [
  "Travel, street, and landscape work arranged as a moving contact wall.",
  "Use wheel or trackpad to move laterally through the sequence.",
  "Frames open in a new tab for a cleaner full-size preview.",
];

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
