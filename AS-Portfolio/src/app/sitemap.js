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
      fetch(`${BASE_URL}/api/skills`),

    ]);
    // Handle projects data
    const projects = projectsResponse.status === 'fulfilled'
      ? await projectsResponse.value.json().catch(() => [])
      : [];

    // Handle blog data
    const blogData = blogResponse.status === 'fulfilled'
      ? await blogResponse.value.json().catch(() => [])
      : [];
    // Handle skills data


    // Create dynamic routes with validation
    // projects
    const projectPages = (Array.isArray(projects) ? projects : []).map((project) => ({
      url: `${BASE_URL}/api/projects/${project.title}`,
      lastModified: new Date(project.updatedAt || Date.now()),
      priority: 0.9,
    }));

    const blogPages = (Array.isArray(blogData) ? blogData : []).map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.createdAt || Date.now()),
      priority: 0.6,
    }));

    // skills
    const skills = await fetch(`${BASE_URL}/api/skills`).then(res => res.json());
    const skillPages = skills.map((skill) => ({
      url: `${BASE_URL}/api/skills/${skill._id}`,
      lastModified: new Date(skill.date || Date.now()),
      priority: 0.5,
    }));
    // feedback
    const feedback = await fetch(`${BASE_URL}/api/feedback`).then(res => res.json());
    const feedbackPages = feedback.map((feedback) => ({
      url: `${BASE_URL}/api/feedback/${feedback._id}`,
      lastModified: new Date(feedback.createdAt || Date.now()),
      priority: 0.4,
    }));
    // Certificates
    const certificates = await fetch(`${BASE_URL}/api/Certificates`).then(res => res.json());
    const certificatePages = certificates.map((certificate) => ({
      url: `${BASE_URL}/api/Certificates/${certificate._id}`,
      lastModified: new Date(certificate.date || Date.now()),
      priority: 0.3,
    }));

    // Subscribes
    const subscribes = await fetch(`${BASE_URL}/api/subscribe`).then(res => res.json());
    const subscribePages = subscribes.map((subscribe) => ({
      url: `${BASE_URL}/api/subscribe/${subscribe._id}`,
      lastModified: new Date(subscribe.createdAt || Date.now()),
      priority: 0.2,
    }));


    return [...staticPages, ...projectPages, ...blogPages, ...skillPages, ...feedbackPages, ...certificatePages, ...subscribePages];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages as fallback
    return staticPages;
  }
}