module.exports = {
  url: "https://doctorj.in",
  name: "Dr. Jishnu Mohan",
  siteName: "Dr. Jishnu Mohan — Surgical Design Studio",
  themeColor: "#191919",
  ogImage: "https://doctorj.in/images/og-share.jpg",
  email: "drjishnumaxcfac@gmail.com",
  emailObfuscated:
    "&#100;&#114;&#106;&#105;&#115;&#104;&#110;&#117;&#109;&#97;&#120;&#99;&#102;&#97;&#99;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;",
  phone: "+91 8848 026 261",
  phoneHref: "+918848026261",
  instagram: "https://www.instagram.com/dr.j__________/",
  linkedin: "https://www.linkedin.com/in/dr-jishnu-mohan-8881233a0/",
  googleBusiness: "https://share.google/tDS4gSuJcUU8MErWE",
  reviewCount: "105",
  reviewRating: "5.0",

  // Schema fragments — reused so Person/Organization data lives in one place
  // instead of being duplicated inside every page's <script type="application/ld+json">.
  personSchema: {
    "@type": "Person",
    "@id": "https://doctorj.in/#person",
    name: "Dr. Jishnu Mohan",
    url: "https://doctorj.in/",
    image: "https://doctorj.in/images/hero.jpg",
    jobTitle: "Consultant Head and Neck Surgical Oncologist",
    description:
      "Surgeon-scientist and medical technology innovator designing instruments, implants, and devices for resource-limited surgical care.",
    medicalSpecialty: [
      "Oral and Maxillofacial Surgery",
      "Head and Neck Surgical Oncology",
    ],
    worksFor: {
      "@type": "MedicalOrganization",
      name: "Homi Bhabha Cancer Hospital and Research Centre, Muzaffarpur",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Muzaffarpur",
        addressRegion: "Bihar",
        addressCountry: "IN",
      },
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Pt. B.D. Sharma University of Health Sciences, PGIMS Rohtak",
      },
      { "@type": "CollegeOrUniversity", name: "Rajiv Gandhi University of Health Sciences" },
    ],
    email:
      "mailto:&#100;&#114;&#106;&#105;&#115;&#104;&#110;&#117;&#109;&#97;&#120;&#99;&#102;&#97;&#99;&#64;&#103;&#109;&#97;&#105;&#108;&#46;&#99;&#111;&#109;",
    telephone: "+91-8848-026-261",
    sameAs: [
      "https://www.linkedin.com/in/dr-jishnu-mohan-8881233a0/",
      "https://www.instagram.com/dr.j__________/",
      "https://share.google/tDS4gSuJcUU8MErWE",
    ],
  },

  nav: [
    { href: "/", label: "Home", key: "home" },
    { href: "/clinical/", label: "Clinical", key: "clinical" },
    { href: "/projects/", label: "Projects", key: "projects" },
    { href: "/blog/", label: "Blog", key: "blog" },
    { href: "/about.html", label: "About", key: "about" },
    { href: "/publications.html", label: "Publications", key: "bibliography" },
    { href: "/contact.html", label: "Contact", key: "contact" },
  ],

  footerLocations: [
    { href: "/locations/kochi/", label: "Kochi" },
    { href: "/locations/ernakulam/", label: "Ernakulam" },
    { href: "/locations/edapally/", label: "Edapally" },
    { href: "/locations/kakkanad/", label: "Kakkanad" },
    { href: "/locations/thrissur/", label: "Thrissur" },
    { href: "/locations/kottayam/", label: "Kottayam" },
  ],

  address: "Thejus, Kizhakke Velikakathu Lane,<br>Near Anjumana Temple, Edapally,<br>Kochi, Kerala 682024",
};
