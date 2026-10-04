const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // ---------------------------------------------------------------------
  // 1. Everything already live (index.html, /clinical/, /projects/,
  //    /locations/, assets, fonts, images, robots.txt, sitemap.xml, etc.)
  //    is copied through UNCHANGED. Eleventy never re-templates these —
  //    zero risk of regressing pages that already work and are indexed.
  // ---------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy({ content: "." });

  // Decap CMS admin UI — static files, just copied through.
  eleventyConfig.addPassthroughCopy("admin");

  // Media uploaded via Decap's media library.
  eleventyConfig.addPassthroughCopy({ "images/uploads": "images/uploads" });

  // ---------------------------------------------------------------------
  // 2. Only the blog is actually "built" by Eleventy, from Markdown.
  //    This is the piece Decap CMS edits.
  // ---------------------------------------------------------------------
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("blog/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Filters used by the blog templates
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // JSON-LD builders for blog posts (kept in JS so the template stays readable)
  eleventyConfig.addFilter("articleSchema", (d, site, pageUrl) => {
    const iso = (x) => DateTime.fromJSDate(x, { zone: "utc" }).toFormat("yyyy-LL-dd");
    const url = site.url + pageUrl;
    const o = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": url + "#article",
      headline: d.title,
      description: d.description,
      datePublished: iso(d.date),
      dateModified: iso(d.updated || d.date),
      inLanguage: "en-IN",
      isAccessibleForFree: true,
      author: { "@type": "Person", "@id": site.url + "/#person", name: site.name, url: site.url + "/about.html" },
      publisher: {
        "@type": "Organization",
        "@id": site.url + "/#organization",
        name: "Dr. Jishnu Mohan, Surgical Design Studio",
        url: site.url + "/",
        logo: { "@type": "ImageObject", url: site.url + "/apple-touch-icon.png" },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      image: d.ogImage || (d.image ? site.url + d.image : site.ogImage),
      speakable: { "@type": "SpeakableSpecification", cssSelector: [".quick-answer", ".pd-title"] },
    };
    if (d.keywords) o.keywords = d.keywords;
    if (Array.isArray(d.references) && d.references.length) {
      o.citation = d.references.map((r) => ({
        "@type": "ScholarlyArticle",
        name: r.text,
        url: "https://pubmed.ncbi.nlm.nih.gov/" + r.pmid + "/",
        sameAs: "https://doi.org/" + r.doi,
      }));
    }
    return o;
  });

  eleventyConfig.addFilter("withContext", (o) => Object.assign({ "@context": "https://schema.org" }, o));

  eleventyConfig.addFilter("faqSchema", (faq) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faq || []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }));

  eleventyConfig.addFilter("pad2", (num) => String(num).padStart(2, "0"));

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
