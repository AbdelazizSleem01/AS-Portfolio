import AboutMeComponent from "./components/AboutMeComponent";
import HomePageCertificates from "./components/Certificates/HomePageCertificate";
import FeedbackSection from "./components/Feedback/FeedbackSection";
import HomePage from "./components/HomePage";
import HomePageProjects from "./components/Projects/HomePageProjects";
import HomePageSkills from "./components/Skills/HomePageSkills";

export default function Home() {

  return (
    <div>
      <HomePage />
      <AboutMeComponent />
      <HomePageProjects />
      <HomePageSkills />
      <HomePageCertificates />
      <FeedbackSection />
    </div>
  );
}
