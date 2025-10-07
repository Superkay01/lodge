'use client';
import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Image from 'next/image'; 


const partnerLogos = [
  {
    id: 1,
    logo: '/logo.png', 
    alt: 'Partner 1',
  },
  {
    id: 2,
    logo: '/logo.png', 
    alt: 'Partner 2',
  },
  {
    id: 3,
    logo: '/logo.png', 
    alt: 'Partner 3',
  },
  {
    id: 4,
    logo: '/logo.png', 
    alt: 'Partner 4',
  },
  {
    id: 5,
    logo: '/logo.png', 
    alt: 'Partner 5',
  },
  {
    id: 6,
    logo: '/logo.png', 
    alt: 'Partner 6',
  },
];

const PartnerLogos = () => {
  const settings = {
    dots: false,  
    infinite: true,  
    speed: 500,  
    slidesToShow: 5,  
    slidesToScroll: 1,  
    autoplay: true,  
    autoplaySpeed: 2000,  
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-white" >
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">Our Trusted Partners</h2>
        <Slider {...settings}>
          {partnerLogos.map((partner) => (
            <div key={partner.id} className="px-6">
              <Image
                src={partner.logo}
                alt={partner.alt}
                width={150}  
                height={100}  
                objectFit="contain"  
                className="mx-auto"  
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PartnerLogos;
