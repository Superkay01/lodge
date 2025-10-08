'use client';
import Slider from 'react-slick';  
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';  
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    text: "This service was amazing! I found my dream home within weeks, and the process was so easy. Highly recommend!",
    name: "Akintoye Oyebamiji",
    title: "Happy Customer",
    image: "/Testimony1.jpg",  
  },
  {
    id: 2,
    text: "The team was professional, and they really helped me find the right place. Excellent experience overall.",
    name: "Olaniyi Boluwatife",
    title: "Satisfied Client",
    image: "/Testimony2.jpg",  
  },
  {
    id: 3,
    text: "I couldn't have asked for a better experience! The platform is easy to navigate and the support is excellent.",
    name: "Adeleye Titilayo",
    title: "Real Estate Buyer",
    image: "/Testimony3.jpg",  
  },
  {
    id: 4,
    text: "An outstanding service! The property options were vast, and the team ensured everything was perfect for me.",
    name: "Kolawole Grace",
    title: "Homeowner",
    image: "/Testimony1.jpg", 
  },
];

const TestimonialsCarousel = () => {
  const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
       
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

  return (
    <section className="py-16 bg-gray-50 pb-30">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">What Our Customers Say</h2>
        <Slider {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white space-x-5 px-7 py-7 mx-10 rounded-lg shadow-lg h-[230px]">
              {/* Testimonial text */}
              <div className="relative mb-6 ">
                <FaQuoteLeft size={20} className="absolute left-0 top-0 text-4xl text-gray-500" />
                <p className="text-xl text-gray-600 italic px-4">{testimonial.text}</p>
                <FaQuoteRight size={20} className="absolute right-0 bottom-0 text-4xl text-gray-500" />
              </div>
              
              {/* Customer info */}
              <div className="flex justify-center items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={128}
                  className="w-16 h-16 rounded-full object-cover object:top-center"
                />
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
