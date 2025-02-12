/** @type {import('next').NextConfig} */
const nextConfig = {
    // allow for vercel links
    experimental: {
        linksInProduction: true,
    },
    images: {
        domains: ['a8mzjiayucvjwt55.public.blob.vercel-storage.com'],
    },
    api: {
        bodyParser: {
            sizeLimit: "200mb", 
        },
    },

};

export default nextConfig;
