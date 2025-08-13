export default function Visits() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
            {/* Page Title */}
            <h2 className="text-3xl font-bold text-neutral mb-8">
                Analytic Page
            </h2>

            {/* Link Button */}
            <a
                href="https://vercel.com/abdelazizsleem01s-projects/as-portfolio/analytics"
                target="_blank"
                rel="noopener noreferrer" 
                className=" px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/95 transition duration-300 ease-in-out transform hover:scale-105"
                title="Visits Analytics"
            >
                View Analytics on Vercel
            </a>
        </div>
    );
}