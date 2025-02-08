// app/sitemap.js

const BASE_URL = 'https://as-portfolio-ten.vercel.app/';

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

    const projects = await fetch(`${BASE_URL}/api/projects`).then((res) =>
        res.json()
      );
    const blogData = await fetch(`${BASE_URL}/api/posts`).then((res) =>
        res.json()
      );

    // Dynamic project pages
    const projectPages = projects.map((project) => ({
        url: `${BASE_URL}/projects/${project.projectId}`,
        lastModified: new Date(project.date),
        priority: 0.6,
      }));

    // Dynamic blog pages
    const blogPages = blogData.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.createdAt || Date.now()),
        priority: 0.6,
    }));

    return [...staticPages, ...projectPages, ...blogPages];
}