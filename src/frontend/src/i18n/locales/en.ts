import type { LocaleMessages } from "../types";

export const enMessages: LocaleMessages = {
  nav: {
    title: "Casper Photography",
    subtitle: "Moments caught between wandering and wondering.",
    primaryAria: "Primary",
    home: "Home",
    about: "About",
    galleries: "Galleries",
    contactMe: "Contact Me",
    languageLabel: "Language",
  },
  footer: {
    copyright: "Copyright © 2026 Casper Photography. All rights reserved.",
  },
  home: {
    ariaPortfolioGallery: "Portfolio gallery",
    openPhotoViewerAria: (title) => `Open ${title} in the photo viewer`,
    galleryTitle: "Home",
  },
  about: {
    title: "About Casper Photography",
    subtitle: "Visual notes, process, and collaboration details.",
    ariaSection: "About Casper Photography",
  },
  contact: {
    title: "Contact Me",
    subtitle: "Share your idea, location, and timeline to start planning the shoot.",
    ariaSection: "Contact Casper Photography",
    bookingsHeading: "Bookings",
    bookingsBody:
      "For editorial, travel, and brand collaborations, send a short brief with dates, location, and expected deliverables.",
    emailHeading: "Email",
    responseHeading: "Response Time",
    responseBody: "Usually within 24 to 48 hours.",
  },
  galleryIndex: {
    title: "Galleries",
    subtitle: "Browse the portfolio archives by collection.",
    ariaOverview: "Galleries overview",
    kicker: "Collections",
    summary: "Enter the archive through curated sets of travel, street, and landscape work.",
    collectionsCount: (count) => `${count} collection${count === 1 ? "" : "s"}`,
    selectGallery: "Select a gallery",
    ariaCollections: "Gallery collections",
    openGallery: "Open gallery",
  },
  galleryPage: {
    fallbackTitle: "Gallery",
    notFoundSubtitle: "This gallery could not be found.",
    ariaNotFound: "Gallery not found",
    fallbackKicker: "Archive",
    notFoundHeading: "Not Found",
    notFoundSummary: "This gallery identifier is not available yet. Try gallery 1.",
    ariaPortfolio: "Portfolio gallery",
    shareAria: (galleryTitle) => `Share ${galleryTitle}`,
    shareButton: "Share",
    framesCount: (count) => `${count} frames`,
    clickForDetails: "Click for details",
    notesAria: "Gallery notes",
    ariaStream: "Portfolio gallery stream",
    openDetailsAria: (photoTitle) => `Open details for ${photoTitle}`,
    scrollTopAria: "Scroll gallery to top",
  },
  photoViewer: {
    ariaLabel: (photoTitle, galleryTitle) =>
      photoTitle ? `Photo detail: ${photoTitle}` : `${galleryTitle} photo detail`,
    loadingAria: "Loading photo",
    metadataAria: "Photo metadata",
    metadataTitle: "EXIF Metadata",
  },
  shareDialog: {
    ariaLabel: (galleryTitle) => `Share ${galleryTitle}`,
    title: "Share This Page",
    description: "Choose where to share the current link.",
    optionsAria: "Share options",
    copyAria: "Copy current link",
    copyLabel: "Copy Link",
    shareToAria: (label) => `Share to ${label}`,
    copySuccess: "Link copied to clipboard.",
    copyError: "Could not copy link. Please copy from the address bar.",
  },
  baseDialog: {
    closeAria: "Close dialog",
  },
  exifLabels: {
    camera: "Camera",
    lens: "Lens",
    aperture: "Aperture",
    shutterSpeed: "Shutter Speed",
    iso: "ISO",
    focalLength: "Focal Length",
    location: "Location",
  },
  galleries: {
    "1": {
      id: "1",
      kicker: "Archive",
      title: "Harbor Light",
      subtitle: "A structured edit with notes, sequencing, and vertical studies.",
      summary: "A horizontal edit of field notes, road edges, weather, and passing light.",
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
  },
  aboutPanels: [
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
  ],
  demo: {
    title: (index) => `Demo ${index + 1}`,
    description: "A captured moment balancing texture, movement, and available light.",
  },
};
