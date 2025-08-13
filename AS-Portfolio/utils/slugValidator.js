export const validateSlug = (slug) => {
    // Allow letters, numbers, and hyphens
    const validSlugRegex = /^[a-z0-9-]+$/;
    return validSlugRegex.test(slug);
  };
  
  export const sanitizeSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w-]+/g, '')  // Remove all non-word chars
      .replace(/--+/g, '-')     // Replace multiple - with single
      .replace(/^-+/, '')       // Trim - from start
      .replace(/-+$/, '');      // Trim - from end
  };