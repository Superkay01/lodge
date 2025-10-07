'use client';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'; // Import social media icons
import Image from 'next/image';
const teamMembers = [
  {
    name: 'Carls Jhons',
    title: 'Real Estate Agent',
    image: '/Team1.jpg', 
    socialLinks: {
      facebook: 'https://web.facebook.com/profile.php?id=100072523573846',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Arling Tracy',
    title: 'Real Estate Agent',
    image: '/Team2.jpg', // Replace with the correct path for the image
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Mark Web',
    title: 'Real Estate Agent',
    image: '/Team3.jpg', // Replace with the correct path for the image
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Katy Grace',
    title: 'Real Estate Agent',
    image: '/Team4.jpg', // Replace with the correct path for the image
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Chris Melo',
    title: 'Real Estate Agent',
    image: '/Team3.jpg', // Replace with the correct path for the image
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
  {
    name: 'Nina Thomas',
    title: 'Real Estate Agent',
    image: '/Team1.jpg', 
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
    },
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 bg-[#0025cc]">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6 text-white">Meet Our Team</h2>
        <p className="text-xl mb-10 text-white">Our experienced agents are here to help you find the perfect property</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={350}
                height={420}
                className="w-full h-68 object-cover"
              />
              {/* Team Member Info */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#0025cc]">{member.name}</h3>
                <p className="text-sm text-[#0025cc]">{member.title}</p>
                {/* Social Media Icons */}
                <div className="mt-4 flex justify-center gap-4">
                  <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#9faffa] hover:text-blue-600">
                    <FaFacebookF size={20} />
                  </a>
                  <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-[#9faffa] hover:text-blue-400">
                    <FaTwitter size={20} />
                  </a>
                  <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#9faffa] hover:text-pink-600">
                    <FaInstagram size={20} />
                  </a>
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#9faffa] hover:text-blue-700">
                    <FaLinkedinIn size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
