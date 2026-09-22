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
