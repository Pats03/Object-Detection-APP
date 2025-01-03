import React, { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'How does the object detection work with CCTV camera links?',
      answer:
        'Once you provide the CCTV camera link, our AI system processes images and detects people in real-time. It works with most modern CCTV cameras.',
    },
    {
      question: 'Do I need to install any special software on my CCTV?',
      answer:
        'No. Simply provide the CCTV camera URL. The system integrates without additional installations on your camera.',
    },
    {
      question: 'How accurate is the people-counting detection?',
      answer:
        'The system uses advanced AI models with high accuracy. Accuracy can vary based on camera quality, lighting, and angle.',
    },
    {
      question: 'Do I need to install any special software on my CCTV?',
      answer:
        'No. Simply provide the CCTV camera URL. The system integrates without additional installations on your camera.',
    },
    {
      question: 'How does the object detection work with CCTV camera links?',
      answer:
        'Once you provide the CCTV camera link, our AI system processes images and detects people in real-time. It works with most modern CCTV cameras.',
    },
  ];

  const toggleAnswer = (index) => {
    if (openIndex === index) {
      setOpenIndex(null); // Close if clicked again
    } else {
      setOpenIndex(index); // Open the clicked question
    }
  };

  return (
    <section className="py-10 px-4 md:px-20 bg-black">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-black rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-lg font-semibold text-white">
                {item.question}
              </h3>
              <span className="text-white">
                {openIndex === index ? '-' : '+'}
              </span>
            </div>
            {openIndex === index && (
              <p className="text-white-700 mt-2 text-sm italic bg-gray-800 p-4 rounded-lg shadow-inner">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
