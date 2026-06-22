import React from 'react';
import Container from '../components/Container';
import { Users, DollarSign, CalendarCheck, ArrowDownToLine } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Users size={24} />,
      title: 'Create Your Group',
      description: 'Start by creating your Njangi group and inviting members from your community.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: <CalendarCheck size={24} />,
      title: 'Set Up Collection Schedule',
      description: 'Define contribution amounts, frequency, and rotation order for fund distribution.',
      color: 'bg-teal-100 text-teal-700',
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Collect Contributions',
      description: 'Members make regular contributions through our secure payment system.',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      icon: <ArrowDownToLine size={24} />,
      title: 'Distribute Funds',
      description: 'Funds are automatically distributed to members according to the defined schedule.',
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How NAAS Works
          </h2>
          <p className="text-xl text-gray-600">
            A simple, transparent process to manage your community savings
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-0.5 h-[calc(100%-8rem)] bg-blue-200 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl shadow-sm border border-gray-100 bg-white ${
                  index % 2 === 1 ? 'md:translate-y-24' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${step.color}`}>
                    {step.icon}
                  </div>
                  <span className="text-xl font-semibold text-gray-900">
                    {index + 1}. {step.title}
                  </span>
                </div>
                <p className="text-gray-600 ml-14">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;