import React from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Recycle, FileCheck, Users, Leaf, Wind, Map
} from 'lucide-react';

function ServicesSection() {
  const services = [
    {
      icon: Recycle,
      title: 'Waste Management',
      desc: [
        'Comprehensive solutions for Solid, Plastic, Legacy, Biomedical, and E-waste Management.',
        'Design and implementation of Integrated Waste Management Systems — including door-to-door collection, segregation, treatment, and scientific disposal.',
        'Circular Economy interventions, EPR advisory, bioremediation, and landfill reclamation for sustainable urban systems.'
      ]
    },
    {
      icon: FileCheck,
      title: 'Environmental Sustainability',
      desc: [
        'EIA, EMP, and Environmental Audits for industries, infrastructure, and development projects.',
        'Sustainability and ESG Strategy, including SDG alignment, BRSR, and GRI reporting.',
        'Resource efficiency, pollution prevention, and green certification support (LEED, GRIHA, ISO 14001).'
      ]
    },
    {
      icon: Users,
      title: 'Social Development & Socio-Economic Studies',
      desc: [
        'Socio-economic and baseline assessments for planning, policy, and project evaluation.',
        'Awareness and behavior change campaigns for ULBs, industries, and communities.',
        'Community engagement, inclusion of informal sector workers, and CSR-driven livelihood initiatives.'
      ]
    },
    {
      icon: Leaf,
      title: 'Natural Resource Management',
      desc: [
        'Afforestation, watershed management, and rainwater harvesting for ecological restoration.',
        'Biodiversity conservation, land reclamation, and sustainable agriculture promotion.',
        'Participatory resource governance and ecosystem valuation to enhance local resilience.'
      ]
    },
    {
      icon: Wind,
      title: 'Climate Change Mitigation & Adaptation',
      desc: [
        'Carbon footprinting, GHG inventories, and MRV systems for policy and project-level implementation.',
        'Climate resilience and disaster risk reduction planning for governments and businesses.',
        'Renewable energy advisory and development of Net Zero and low-carbon transition strategies.'
      ]
    },
    {
      icon: Map,
      title: 'GIS Mapping & Real-Time Data Dashboards',
      desc: [
        'Development of GIS-based mapping and visualization tools for environmental and social datasets.',
        'Spatial planning and monitoring of waste, resource, and community infrastructure.',
        'Real-time dashboards and decision-support systems for evidence-based management and reporting.'
      ]
    }
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="services" ref={ref} className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-green-500">Expertise</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive environmental solutions tailored to your needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 cursor-pointer border border-gray-100"
              style={{ willChange: 'transform' }}
            >
              <service.icon className="w-14 h-14 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {service.desc.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
