// Replace these four groups when the approved assets and destinations are ready.
// Asset paths are relative to public/, e.g. "assets/studhive-logo.svg".
export default {
  name: "Studhive",
  fullName: "Students’ Hive",
  tagline: "Pollinating education champions.",
  origin: (process.env.SITE_URL || "https://studhive.org").replace(/\/$/, ""),
  logo: { primary: null, reversed: null },
  photos: {
    hero: null,
    fellowship: null,
    dialogue: null,
    career: null,
    gallery: [], // { src: 'assets/photo.jpg', alt: 'Describe the real event', caption: '...' }
  },
  contact: {
    email: null,
    phone: null,
    address: null,
    social: { instagram: null, linkedin: null, facebook: null, x: null },
  },
  joinUrl: null,
};
