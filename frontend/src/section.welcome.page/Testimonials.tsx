import React from 'react';
import Container from '../components/Container';
import Testimonial from '../components/Testimonial';
import ateh from "../assets/ateh.jpg"; // Adjust the path as necessary
import ateh1 from "../assets/ateh1.jpg"; // Adjust the path as necessary
import ceo from "../assets/ceo.jpg"; // Adjust the path as necessary
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      content: "NAAS has completely transformed how our community manages savings. What used to take hours of manual tracking now happens automatically, and everyone has full transparency.",
      author: "Ateh Damaris",
      role: "Group Administrator",
      image: ateh
    },
    {
      content: "The automated reminders and secure payment system have increased our collection rate by 95%. Our members love the transparency and ease of use.",
      author: "Nicky Precious",
      role: "Community Leader",
      image: ateh1
    },
    {
      content: "As someone who manages three different savings groups, NAAS has been a game-changer. The ability to customize each group's rules while maintaining consistent reporting is invaluable.",
      author: "Frank Michel",
      role: "Financial Coordinator",
      image: ceo
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of community groups already saving with NAAS
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              image={testimonial.image}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;