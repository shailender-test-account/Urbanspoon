import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../features/menuSlice';
import MenuCard from '../components/MenuCard';

const CATEGORIES = ['pizza', 'chicken', 'drinks', 'desserts', 'sides'];
const DIETARY = ['vegetarian', 'vegan', 'spicy', 'gluten-free'];
const PORTIONS = ['all', 'regular', 'large', 'family'];

export default function Menu() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.menu);

  const [search, setSearch] = useState('');
  const [cats, setCats] = useState([]);
  const [diet, setDiet] = useState([]);
  const [portion, setPortion] = useState('all');
  const [maxPrice, setMaxPrice] = useState(35);
  const [sort, setSort] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!items.length) dispatch(fetchMenu());
  }, [dispatch, items.length]);

  const toggle = (setter) => (v) => setter((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));

  const clear = () => {
    setSearch(''); setCats([]); setDiet([]); setPortion('all'); setMaxPrice(35); setSort('popular');
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = items.filter((i) =>
      (!cats.length || cats.includes(i.category)) &&
      (portion === 'all' || i.portion === portion) &&
      i.price <= maxPrice &&
      (!diet.length || diet.some((d) => i.dietary.includes(d))) &&
      (!q || i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
    );
    const sorters = {
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      popular: (a, b) => b.popularity - a.popularity,
    };
    return [...list].sort(sorters[sort]);
  }, [items, search, cats, diet, portion, maxPrice, sort]);

  const Check = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer" />
      <span className="text-sm text-gray-600 group-hover:text-primary capitalize">{label}</span>
    </label>
  );

  return (
    <>
      <div className="bg-lightGray py-10 md:py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link to="/" className="hover:text-primary">Home</Link><span>/</span><span className="text-dark font-semibold">Full Menu</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-2 font-serif">Full Menu</h1>
              <p className="text-gray-500 text-sm">Dishes made fresh to order, delivered to your door</p>
            </div>
            <div className="relative w-full md:w-96">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search burgers, pizza, drinks..." className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-primary shadow-sm" />
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <button onClick={() => setShowFilters((s) => !s)} className="w-full lg:hidden bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between font-bold text-sm mb-4">
            <span><i className="fa-solid fa-sliders text-primary mr-2" /> Filters</span>
            <i className={`fa-solid fa-chevron-${showFilters ? 'up' : 'down'} text-xs`} />
          </button>
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:sticky lg:top-24`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={clear} className="text-xs text-gray-400 hover:text-primary">Clear all</button>
            </div>
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="font-bold text-sm mb-3">Category</h4>
              <div className="space-y-2.5">{CATEGORIES.map((c) => <Check key={c} label={c} checked={cats.includes(c)} onChange={() => toggle(setCats)(c)} />)}</div>
            </div>
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="font-bold text-sm mb-3">Max Price</h4>
              <input type="range" min="3" max="35" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-gray-500 mt-2"><span>$3</span><span>${maxPrice}</span></div>
            </div>
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="font-bold text-sm mb-3">Portion Size</h4>
              <div className="grid grid-cols-2 gap-2">
                {PORTIONS.map((p) => (
                  <button key={p} onClick={() => setPortion(p)} className={`text-xs font-bold py-2 rounded-lg capitalize transition ${portion === p ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-3">Dietary</h4>
              <div className="space-y-2.5">{DIETARY.map((d) => <Check key={d} label={d} checked={diet.includes(d)} onChange={() => toggle(setDiet)(d)} />)}</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <p className="text-sm text-gray-500 font-semibold">{filtered.length} Menu Items</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-white border border-gray-200 rounded-lg text-xs font-semibold px-3 py-2 focus:outline-none focus:border-primary">
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {loading && <div className="py-20 text-center text-primary text-3xl"><i className="fa-solid fa-spinner fa-spin" /></div>}
          {error && <p className="text-center text-red-500 py-10">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-3xl mx-auto mb-4"><i className="fa-solid fa-utensils" /></div>
              <h3 className="text-xl font-bold mb-2">No items found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
              <button onClick={clear} className="mt-6 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 rounded-full font-bold text-xs">Reset Filters</button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => <MenuCard key={item._id} item={item} />)}
          </div>
        </div>
      </div>
    </>
  );
}
