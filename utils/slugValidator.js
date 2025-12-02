export const validateSlug = (slug) => {
    const validSlugRegex = /^[a-z0-9-]+$/;
    return validSlugRegex.test(slug);
  };
  
  export const sanitizeSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')     
      .replace(/[^\w-]+/g, '')  
      .replace(/--+/g, '-')     
      .replace(/^-+/, '')       
      .replace(/-+$/, '');          
  };