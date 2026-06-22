import React from 'react';
import { FeatureCardProps } from '../types/welcome.page.index.type';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100">
      <div className="p-3 mb-4 rounded-lg bg-blue-50 text-blue-700">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;