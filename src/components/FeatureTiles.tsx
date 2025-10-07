'use client';
import { FaHome, FaUsers, FaHandshake, FaCreditCard } from 'react-icons/fa'; 

const features = [
  {
    icon: <FaHome className="text-4xl text-blue-600" />,
    title: 'Find Your Home',
    description: 'Browse through an extensive collection of properties to find your dream home that fits your needs and budget, all in one place.',
  },
  {
    icon: <FaUsers className="text-4xl text-green-600" />,
    title: 'Trusted by Thousands',
    description: 'Join a growing community of satisfied customers who trust us to help them find the perfect property with ease and confidence.',
  },
  {
    icon: <FaHandshake className="text-4xl text-yellow-600" />,
    title: 'Financing Made Easy',
    description: 'Get the best financing options available with flexible plans, making your property purchase simple and affordable.',
  },
  {
    icon: <FaCreditCard className="text-4xl text-red-600" />,
    title: '24/7 Support',
    description: 'Our customer support team is available round-the-clock to assist you with any questions or concerns, ensuring a smooth experience.',
  },
];


const FeatureTiles = () => {
  return (
    <section className="py-16 bg-cover bg-center" style={{ backgroundImage: 'url(/whychoose.jpg)' }}>


      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Why Choose Us</h2>
        <p className="text-xl mb-10 font-semibold text-white">We offer perfect real estate services</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300"

            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureTiles;
