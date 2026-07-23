export type Locale = "zh-Hant" | "zh-Hans" | "ja";

export type GalleryInfo = {
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  summary: string;
  notes: string[];
};

export type AboutPanel = {
  heading: string;
  text: string;
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

export type LocaleMessages = {
  nav: {
    title: string;
    subtitle: string;
    primaryAria: string;
    home: string;
    about: string;
    galleries: string;
    contactMe: string;
    languageLabel: string;
  };
  footer: {
    copyright: string;
  };
  home: {
    ariaPortfolioGallery: string;
    openPhotoViewerAria: (title: string) => string;
    galleryTitle: string;
  };
  about: {
    title: string;
    subtitle: string;
    ariaSection: string;
  };
  contact: {
    title: string;
    subtitle: string;
    ariaSection: string;
    bookingsHeading: string;
    bookingsBody: string;
    emailHeading: string;
    responseHeading: string;
    responseBody: string;
  };
  galleryIndex: {
    title: string;
    subtitle: string;
    ariaOverview: string;
    kicker: string;
    summary: string;
    collectionsCount: (count: number) => string;
    selectGallery: string;
    ariaCollections: string;
    openGallery: string;
  };
  galleryPage: {
    fallbackTitle: string;
    notFoundSubtitle: string;
    ariaNotFound: string;
    fallbackKicker: string;
    notFoundHeading: string;
    notFoundSummary: string;
    ariaPortfolio: string;
    shareAria: (galleryTitle: string) => string;
    shareButton: string;
    framesCount: (count: number) => string;
    clickForDetails: string;
    notesAria: string;
    ariaStream: string;
    openDetailsAria: (photoTitle: string) => string;
    scrollTopAria: string;
  };
  photoViewer: {
    ariaLabel: (photoTitle: string, galleryTitle: string) => string;
    loadingAria: string;
    metadataAria: string;
    metadataTitle: string;
  };
  shareDialog: {
    ariaLabel: (galleryTitle: string) => string;
    title: string;
    description: string;
    optionsAria: string;
    copyAria: string;
    copyLabel: string;
    shareToAria: (label: string) => string;
    copySuccess: string;
    copyError: string;
  };
  baseDialog: {
    closeAria: string;
  };
  exifLabels: ExifLabels;
  galleries: Record<string, GalleryInfo>;
  aboutPanels: AboutPanel[];
  demo: {
    title: (index: number) => string;
    description: string;
  };
};
