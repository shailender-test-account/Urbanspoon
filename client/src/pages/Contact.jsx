import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openBookingModal } from '../features/uiSlice';

const skills = [
  ['Culinary Skills', 85],
  ['Leadership & Management', 95],
  ['Creativity & Innovation', 80],
  ['Time Management', 86],
  ['Kitchen Operations & Efficiency', 95],
  ['Menu Development', 85],
];

const insta = [
  'photo-1552566626-52f8b828add9', 'photo-1517248135467-4c7edcad34c4', 'photo-1600891964092-4316c288032e',
  'photo-1414235077428-338989a2e8c0', 'photo-1592861956120-e524fc739696', 'photo-1559339352-11d035aa65de',
];

const contactRows = [
  ['fa-envelope', 'chef@urbanspoon.com'],
  ['fa-phone', '+1 (888) 123-4567'],
  ['fa-medal', '18+ Years of Experience'],
];

export default function Contact() {
  const dispatch = useDispatch();
  const skillsRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setAnimate(true), { threshold: 0.2 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden bg-dark">
        <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop" alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-serif">Contact & Chef</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-primary">Home</Link><span>|</span><span className="text-primary font-semibold">Contact Us</span>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative w-72 h-96 md:w-80 md:h-[450px]">
              <div className="absolute inset-0 bg-primary/10 rounded-t-full rounded-b-3xl -rotate-3" />
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800&auto=format&fit=crop" alt="Executive Chef" className="relative z-10 w-full h-full object-cover rounded-t-full rounded-b-3xl shadow-2xl" />
            </div>
          </div>
          <div className="w-full lg:w-7/12">
            <h2 className="text-4xl font-bold mb-2 font-serif">Leslie Alexander</h2>
            <p className="text-primary font-semibold text-lg mb-6">Executive Chef</p>
            <p className="text-gray-600 leading-relaxed mb-8">Chef Leslie leads the Urban Spoon kitchen with a simple belief: great food starts with fresh ingredients and honest technique. Her menus blend comfort classics with bold, modern flavours.</p>
            <div className="space-y-4 mb-8">
              {contactRows.map(([icon, text]) => (
                <div key={text} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition"><i className={`fa-solid ${icon}`} /></div>
                  <span className="text-gray-700 font-medium">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Connect Now</span>
              <div className="flex gap-3">
                {['facebook-f', 'x-twitter', 'linkedin-in', 'instagram'].map((s) => (
                  <a key={s} href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition hover:scale-110"><i className={`fa-brands fa-${s}`} /></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={skillsRef} className="bg-lightGray py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-10 font-serif">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {skills.map(([name, pct]) => (
              <div key={name}>
                <div className="flex justify-between mb-2 text-sm font-semibold"><span>{name}</span><span>{pct}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-[1500ms] ease-out" style={{ width: animate ? `${pct}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-primary font-bold tracking-widest text-sm uppercase mb-2">Reserve A Table</p>
            <h2 className="text-4xl md:text-5xl font-bold font-serif">Dine With Us – <span className="text-primary">Reserve Now</span></h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-primary text-3xl"><i className="fa-solid fa-calendar-check" /></div>
              <h3 className="text-2xl font-bold">Book your table in seconds</h3>
              <p className="text-gray-500 text-sm max-w-md">Pick a date, time and party size. We'll confirm your reservation and keep you updated on WhatsApp.</p>
              <button onClick={() => dispatch(openBookingModal())} className="bg-primary hover:bg-primaryHover text-white px-8 py-3.5 rounded-full font-bold text-sm transition hover:-translate-y-1 shadow-lg shadow-orange-200">BOOK A TABLE</button>
            </div>
            <div className="bg-dark rounded-2xl p-8 text-white space-y-6">
              <div><h3 className="text-2xl font-bold mb-2 font-serif">Address</h3><p className="text-gray-300 text-sm">123 Foodie Street, New York, NY 10001</p></div>
              <div><h3 className="text-2xl font-bold mb-2 font-serif">Contact</h3><p className="text-gray-300 text-sm">Phone: +1 (888) 123-4567</p><p className="text-gray-300 text-sm">Email: hello@urbanspoon.com</p></div>
              <div><h3 className="text-2xl font-bold mb-2 font-serif">Open Time</h3><p className="text-gray-300 text-sm">Mon – Fri: 11:00 AM – 10:00 PM</p><p className="text-gray-300 text-sm">Sat – Sun: 09:00 AM – 11:00 PM</p></div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="https://www.google.com/maps/search/?api=1&query=123+Foodie+Street+New+York+NY+10001" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white border border-gray-200 hover:border-primary hover:text-primary px-8 py-4 rounded-full font-bold text-sm shadow-sm hover:shadow-lg transition hover:-translate-y-1">
              <i className="fa-solid fa-map-location-dot text-primary text-xl" /> Open Location in Google Maps
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-primary font-bold tracking-widest text-sm uppercase mb-2">Follow Us</p>
            <h2 className="text-4xl md:text-5xl font-bold font-serif">Follow Us On Instagram</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {insta.map((id) => (
              <div key={id} className="relative overflow-hidden rounded-xl h-48 group">
                <img src={`https://images.unsplash.com/${id}?q=80&w=400&auto=format&fit=crop`} alt="Instagram" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-primary/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i className="fa-brands fa-instagram text-white text-3xl" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
