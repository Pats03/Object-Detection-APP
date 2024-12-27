import React from 'react';
import { FaUsers, FaCamera, FaChartBar } from 'react-icons/fa';

const services = [
  {
    title: 'Real-Time People Counting',
    description:
      'Utilize our AI-powered object detection service to count people in real-time at any location, including classrooms, malls, and public areas.',
    icon: <FaUsers className="text-4xl text-blue-500" />,
  },
  {
    title: 'Smart Surveillance',
    description:
      'Monitor large crowds or specific areas with smart surveillance, detecting people and analyzing movement patterns.',
    icon: <FaCamera className="text-4xl text-green-500" />,
  },
  {
    title: 'Data Analytics',
    description:
      'Get valuable insights from detected data such as foot traffic, peak times, and people distribution within spaces.',
    icon: <FaChartBar className="text-4xl text-yellow-500" />,
  },
];

const Service = () => {
  return (
    <section className="py-10 px-4 md:px-20 text-white">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center text-white">
        Our Object Detection Services
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-lg shadow-xl bg-black p-6 max-w-xs text-center transition-transform transform hover:scale-105"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-lg font-semibold text-white">
              {service.title}
            </h3>
            <p className="text-white-700 mt-2">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Service;
