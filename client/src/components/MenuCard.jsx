import { useState } from 'react';

export default function MenuCard({ item }) {
  const [added, setAdded] = useState(false);

  const add = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 group">
      <div className="relative h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        {item.badge && <span className="absolute top-3 left-3 bg-yellow-400 text-dark text-[10px] font-bold px-3 py-1 rounded-full z-10">{item.badge}</span>}
        <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-110 transition duration-500 drop-shadow-lg" />
      </div>
      <div className="p-5">
        <h3 className="font-bold text-base mb-1">{item.name}</h3>
        <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">{item.description}</p>
        <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-4">
          <span className="flex items-center gap-1"><i className="fa-solid fa-star text-yellow-400" /> {item.rating} ({item.reviews})</span>
          <span className="flex items-center gap-1"><i className="fa-regular fa-clock" /> {item.prepTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">${item.price.toFixed(2)}</span>
          <button onClick={add} aria-label={`Add ${item.name}`} className={`${added ? 'bg-green-500 text-white' : 'bg-yellow-400 hover:bg-yellow-500 text-dark'} w-9 h-9 rounded-full flex items-center justify-center transition text-sm shadow-sm`}>
            <i className={`fa-solid ${added ? 'fa-check' : 'fa-plus'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
