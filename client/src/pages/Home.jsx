import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openBookingModal } from '../features/uiSlice';
import { fetchMenu, fetchRecommendations } from '../features/menuSlice';

const features = [
  ['fa-motorcycle', 'Fast Delivery', 'Get your food in 30 minutes'],
  ['fa-shield-halved', 'Best Quality', 'Fresh ingredients & top quality'],
  ['fa-tags', 'Best Prices', 'Great food at affordable prices'],
  ['fa-headset', '24/7 Support', "We're here for you anytime"],
  ['fa-gift', 'Exclusive Offers', 'Enjoy discounts & special deals'],
];

const categories = [
  ['Pizza', '20+ items', 'photo-1513104890138-7c749659a591', 'fa-pizza-slice'],
  ['Burgers', '15+ items', 'photo-1568901346375-23c9450c58cd', 'fa-burger'],
  ['Italian', '18+ items', 'photo-1621996346565-e3dbc646d9a9', 'fa-utensils'],
  ['Sushi', '25+ items', 'photo-1579584425555-c3ce17fd4351', 'fa-fish'],
  ['Desserts', '12+ items', 'photo-1578985545062-69928b1d9587', 'fa-cake-candles'],
  ['Drinks', '10+ items', 'photo-1544145945-f90425340c7e', 'fa-martini-glass-citrus'],
];

const testimonials = [
  ['David Miller', 'Food Blogger', 'photo-1507003211169-0a1dd7228f2d', 5, 'The food arrived hot and incredibly fresh. The Margherita pizza is easily the best I\'ve had in years. Delivery was faster than expected!'],
  ['Sarah Johnson', 'Regular Customer', 'photo-1494790108377-be9c29b29330', 5, 'I ordered for a small family gathering and everyone was blown away. The quality is restaurant-grade, and the presentation was beautiful.'],
  ['James Wilson', 'Verified Buyer', 'photo-1506794778202-cad84cf45f1d', 4.5, 'Urban Spoon has become my go-to for late-night cravings. The burgers are juicy, the fries are crispy, and ordering is a breeze.'],
];

export default function Home() {
  const dispatch = useDispatch();
  const { items, recommendations, recLoading } = useSelector((s) => s.menu);
  const [pref, setPref] = useState('');

  useEffect(() => {
    if (!items.length) dispatch(fetchMenu());
  }, [dispatch, items.length]);

  const popular = items.slice(0, 6);
  const marquee = [...popular, ...popular];

  const askAI = (e) => {
    e.preventDefault();
    if (pref.trim().length >= 2) dispatch(fetchRecommendations(pref.trim()));
  };

  return (
    <>
      {/* HERO */}
      <header className="relative w-full min-h-[600px] lg:h-[700px] flex items-center overflow-hidden bg-dark">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2000&auto=format&fit=crop" alt="Fine dining" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <p className="text-primary font-bold italic text-xl md:text-2xl mb-2 animate-fade-in-up">Delicious Food,</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6 text-white animate-fade-in-up">
              Delivered <br /><span className="text-primary">To You</span>
              <i className="fa-regular fa-heart text-3xl md:text-4xl text-primary ml-2 align-middle animate-pulse" />
            </h1>
            <p className="text-gray-200 text-base md:text-lg mb-8 max-w-md font-light animate-fade-in-up">Your favorite meals from Urban Spoon, delivered fast & fresh to your door.</p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button onClick={() => dispatch(openBookingModal())} className="bg-primary hover:bg-primaryHover text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-lg shadow-orange-900/50 transition hover:-translate-y-1 flex items-center gap-2">
                <i className="fa-solid fa-calendar-check" /> Book a Table
              </button>
              <Link to="/menu" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white text-white hover:text-dark px-8 py-3.5 rounded-full font-bold text-sm transition">Explore Menu</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {['photo-1534528741775-53994a69daeb', 'photo-1506794778202-cad84cf45f1d', 'photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d'].map((id) => (
                  <img key={id} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=100&q=80`} alt="Customer" />
                ))}
              </div>
              <div>
                <p className="font-bold text-sm text-white">10K+ Happy Customers</p>
                <div className="text-yellow-400 text-[10px] mt-0.5">{[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star" />)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 hidden lg:flex bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl items-center gap-4 animate-float z-20">
          <div className="bg-primary/10 p-3 rounded-full text-primary"><i className="fa-solid fa-motorcycle text-2xl" /></div>
          <div><p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Fast Delivery</p><p className="text-xl font-extrabold">30 mins</p></div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30 mb-16">
        <div className="bg-white rounded-2xl p-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center shadow-lg border border-gray-100">
          {features.map(([icon, title, desc], i) => (
            <div key={title} className={`flex flex-col items-center gap-2 group ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition"><i className={`fa-solid ${icon} text-xl`} /></div>
              <div><h4 className="font-bold text-xs md:text-sm">{title}</h4><p className="text-[10px] text-gray-500 mt-1">{desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold">Explore Categories</h2>
          <Link to="/menu" className="text-primary font-semibold hover:text-primaryHover text-xs flex items-center gap-1">View all categories <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(([name, count, img, icon]) => (
            <Link to="/menu" key={name} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="h-28 overflow-hidden relative">
                <img src={`https://images.unsplash.com/${img}?auto=format&fit=crop&w=400&q=80`} alt={name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md text-primary"><i className={`fa-solid ${icon}`} /></div>
              </div>
              <div className="p-3 pt-6 text-center"><h3 className="font-bold text-sm">{name}</h3><p className="text-[10px] text-gray-500 mt-0.5">{count}</p></div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI RECOMMENDER */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-br from-dark to-gray-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-primary font-bold text-xs uppercase tracking-widest mb-2"><i className="fa-solid fa-wand-magic-sparkles mr-1" /> AI Food Finder</p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Not sure what to eat?</h2>
            <form onSubmit={askAI} className="flex flex-col sm:flex-row gap-3">
              <input value={pref} onChange={(e) => setPref(e.target.value)} maxLength={300} placeholder="e.g. something spicy and vegetarian under $10" className="flex-1 px-5 py-3 rounded-full text-sm text-dark outline-none" />
              <button disabled={recLoading} className="bg-primary hover:bg-primaryHover disabled:opacity-60 px-7 py-3 rounded-full font-bold text-sm transition">{recLoading ? 'Thinking…' : 'Recommend'}</button>
            </form>
            {recommendations.length > 0 && (
              <ul className="mt-6 grid md:grid-cols-3 gap-3">
                {recommendations.map((r) => (
                  <li key={r.id} className="bg-white/10 border border-white/10 rounded-xl p-4">
                    <p className="font-bold text-sm text-primary">{r.name}</p>
                    <p className="text-xs text-gray-300 mt-1">{r.reason}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* POPULAR */}
      {popular.length > 0 && (
        <section className="py-10 mb-16 bg-lightGray overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold">Popular Dishes</h2>
            <Link to="/menu" className="text-primary font-semibold hover:text-primaryHover text-xs flex items-center gap-1">View all menu <i className="fa-solid fa-arrow-right" /></Link>
          </div>
          <div className="overflow-hidden py-2">
            <div className="marquee-track">
              {marquee.map((item, i) => (
                <div key={`${item._id}-${i}`} className="w-[260px] shrink-0 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mx-2 group">
                  <div className="h-44 overflow-hidden"><img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /></div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <span className="font-bold text-base text-primary">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* OFFER */}
      <section className="w-full bg-dark relative py-16 mb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full opacity-20 blur-3xl -ml-20 -mt-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-2">Hungry? We've got you!</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">Get <span className="text-primary">20% OFF</span><br />On Your First Order</h2>
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-6 py-3">
              <span className="text-gray-300 text-sm">Use Code:</span><span className="text-primary font-extrabold text-lg tracking-wider">WELCOME20</span>
            </div>
            <p className="text-gray-500 text-[10px] mt-2">Valid on orders over $20</p>
          </div>
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" alt="Promo" className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-full border-4 border-white/10 shadow-2xl animate-float" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-cream py-20 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold mb-3">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4" />
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Real reviews from real food lovers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(([name, role, img, stars, quote]) => (
              <div key={name} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition border border-gray-100">
                <div className="flex text-yellow-400 mb-4 text-sm">
                  {[1, 2, 3, 4, 5].map((n) => <i key={n} className={`fa-solid ${stars >= n ? 'fa-star' : stars >= n - 0.5 ? 'fa-star-half-stroke' : 'fa-star opacity-20'}`} />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">“{quote}”</p>
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" src={`https://images.unsplash.com/${img}?auto=format&fit=crop&w=100&q=80`} alt={name} />
                  <div><h4 className="font-bold text-sm">{name}</h4><p className="text-[10px] text-gray-400">{role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
