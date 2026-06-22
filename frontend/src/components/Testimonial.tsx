import React from 'react';
import { TestimonialProps } from '../types/welcome.page.index.type';

const Testimonial: React.FC<TestimonialProps> = ({
  content,
  author,
  role,
  image,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={author}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">"{content}"</p>
    </div>
  );
};

export default Testimonial;