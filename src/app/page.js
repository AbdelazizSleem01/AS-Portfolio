
import { GoogleAnalytics } from "nextjs-google-analytics";
import AboutMeComponent from "./components/AboutMeComponent";
import HomePageCertificates from "./components/Certificates/HomePageCertificate";
import FeedbackSection from "./components/Feedback/FeedbackSection";
import HomePage from "./components/HomePage";
import HomePageProjects from "./components/Projects/HomePageProjects";
import HomePageSkills from "./components/Skills/HomePageSkills";


export default async function Home() {

  return (
    <div >
      <HomePage />
      {/* <p className="border border-primary w-[80%] mx-auto"></p> */}
      <AboutMeComponent />
      {/* <p className="border border-primary w-[80%] mx-auto"></p> */}
      <HomePageProjects />
      {/* <p className="border border-primary w-[80%] mx-auto"></p> */}
      <HomePageSkills />
      {/* <p className="border border-primary w-[80%] mx-auto"></p> */}
      <HomePageCertificates />
      {/* <p className="border border-primary w-[80%] mx-auto"></p> */}
      <FeedbackSection />
    </div>
  );
}
