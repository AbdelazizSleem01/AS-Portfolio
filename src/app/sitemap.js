// app/sitemap.js

const BASE_URL = 'https://as-portfolio-ten.vercel.app';

export default async function sitemap() {
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${BASE_URL}/projects-page`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about-page`,
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ContactMe`,
      lastModified: new Date(),
      priority: 0.7,
    },
  ];

  try {
    // Fetch dynamic data with error handling
    const [projectsResponse, blogResponse] = await Promise.allSettled([
      fetch(`${BASE_URL}/api/projects`),
      fetch(`${BASE_URL}/api/posts`),
    ]);

    // Handle projects data
    const projects = projectsResponse.status === 'fulfilled' 
      ? await projectsResponse.value.json().catch(() => []) 
      : [];

    // Handle blog data
    const blogData = blogResponse.status === 'fulfilled' 
      ? await blogResponse.value.json().catch(() => []) 
      : [];

    // Create dynamic routes with validation
    const projectPages = (Array.isArray(projects) ? projects : []).map((project) => ({
      url: `${BASE_URL}/projects/${project.projectId}`,
      lastModified: new Date(project.date || Date.now()),
      priority: 0.6,
    }));

    const blogPages = (Array.isArray(blogData) ? blogData : []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt || Date.now()),
      priority: 0.6,
    }));

    return [...staticPages, ...projectPages, ...blogPages];
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages as fallback
    return staticPages;
  }
}