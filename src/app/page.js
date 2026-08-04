import AboutMeComponent from "./components/AboutMeComponent";
import HomePageCertificates from "./components/Certificates/HomePageCertificate";
import FeedbackSection from "./components/Feedback/FeedbackSection";
import HomePage from "./components/HomePage";
import HomePageProjects from "./components/Projects/HomePageProjects";
import HomePageSkills from "./components/Skills/HomePageSkills";
import HomePageExperience from "./components/Experience/HomePageExperience";
import BrandVideoShowcase from "./components/BrandVideoShowcase";

export default function Home() {

  return (
    <div>
      <HomePage />
      <BrandVideoShowcase />
      <AboutMeComponent />
      <HomePageExperience />
      <HomePageProjects />
      <HomePageSkills />
      <HomePageCertificates />
      <FeedbackSection />
    </div>
  );
}
