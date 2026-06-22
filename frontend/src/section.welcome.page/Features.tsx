import React from 'react';
import Container from '../components/Container';
import FeatureCard from '../components/FeatureCard';
import { features } from '../utils/features';

const Features: React.FC = () => {
  

  return (
    <section id="features" className="py-20 bg-gray-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Savings Groups
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to manage your community savings efficiently and securely
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;