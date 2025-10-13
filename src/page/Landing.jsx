import React from 'react'
import Navigation from '../components/Navigation'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import ServicesSection from '../components/ServicesSection'
import ProjectsSection from '../components/ProjectsSection'
import ClientsSection from '../components/ClientsSection'
import ImpactSection from '../components/ImpactSection'
import TeamSection from '../components/TeamSection'
import ContactSection from '../components/ContactSection'
function Landing() {
  return (
    <>
        <div className="font-sans bg-white">

        <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ClientsSection />
      {/* <ImpactSection />
      <TeamSection /> */}
      <ContactSection />
      </div>
    </>
  )
}

export default Landing