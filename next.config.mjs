/** @type {import('next').NextConfig} */
const nextConfig = {
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
