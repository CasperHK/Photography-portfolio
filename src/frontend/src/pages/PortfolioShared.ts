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

export const createDemoPhotos = (count = 30): Photo[] => {
  return Array.from({ length: count }, (_, i) => {
    const [w, h] = DEMO_TILE_SIZES[i % DEMO_TILE_SIZES.length];
    const seed = `portfolio-${i + 1}`;

    return {
      id: 10000 + i,
      title: `Demo ${i + 1}`,
      description: "",
      fileUrl: `https://picsum.photos/seed/${seed}/${w * 2}/${h * 2}`,
      thumbUrl: `https://picsum.photos/seed/${seed}/${w}/${h}`,
      width: w,
      height: h,
      sortOrder: i,
    };
  });
};

export const toMediaUrl = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${MEDIA_BASE}${path}`;

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
