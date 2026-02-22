import { useReducer, useMemo, useCallback, useRef, useState, createContext, useContext } from "react";

export const CATEGORIES = {
  Buah: "🍎",
  Sayuran: "🥦",
  Minuman: "🧃",
  Makanan: "🍞",
  Lainnya: "🛒",
};

const INITIAL_ITEMS = [
  { id: 1, name: "Apel", category: "Buah", qty: 3, checked: false },
  { id: 2, name: "Bayam", category: "Sayuran", qty: 1, checked: false },
  { id: 3, name: "Jus Jeruk", category: "Minuman", qty: 2, checked: true },
];

function itemsReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), checked: false, ...action.payload }];
    case "TOGGLE":
      return state.map((item) =>
        item.id === action.id ? { ...item, checked: !item.checked } : item
      );
    case "DELETE":
      return state.filter((item) => item.id !== action.id);
    case "CLEAR_DONE":
      return state.filter((item) => !item.checked);
    default:
      return state;
  }
}

const ShoppingContext = createContext(null);

function useShoppingContext() {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error("useShoppingContext harus dipakai di dalam ShoppingProvider");
  return ctx;
}

function ShoppingProvider({ children }) {
  const [items, dispatch] = useReducer(itemsReducer, INITIAL_ITEMS);
  const [filter, setFilter] = useState("Semua");

  const addItem = useCallback((payload) => dispatch({ type: "ADD", payload }), []);
  const toggleItem = useCallback((id) => dispatch({ type: "TOGGLE", id }), []);
  const deleteItem = useCallback((id) => dispatch({ type: "DELETE", id }), []);
  const clearDone = useCallback(() => dispatch({ type: "CLEAR_DONE" }), []);

  const filteredItems = useMemo(() => {
    if (filter === "Belum") return items.filter((i) => !i.checked);
    if (filter === "Selesai") return items.filter((i) => i.checked);
    return items;
  }, [items, filter]);

  const stats = useMemo(() => ({
    total: items.length,
    done: items.filter((i) => i.checked).length,
    progress: items.length ? (items.filter((i) => i.checked).length / items.length) * 100 : 0,
  }), [items]);

  const value = useMemo(
    () => ({ filteredItems, stats, filter, setFilter, addItem, toggleItem, deleteItem, clearDone }),
    [filteredItems, stats, filter, addItem, toggleItem, deleteItem, clearDone]
  );

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

function Header() {
  const { stats } = useShoppingContext();
  return (
    <>
      <header>
        <div className="header-icon">🛍️</div>
        <div>
          <h1>Daftar Belanja</h1>
          <p className="subtitle">
            {stats.done}/{stats.total} item selesai
          </p>
        </div>
      </header>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
      </div>
    </>
  );
}

function AddItemForm() {
  const { addItem } = useShoppingContext();
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState("Lainnya");

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    addItem({ name: input.trim(), qty: Number(qty), category });
    setInput("");
    setQty(1);
    inputRef.current?.focus();
  }, [input, qty, category, addItem]);

  const handleKeyDown = useCallback(
    (e) => { if (e.key === "Enter") handleSubmit(); },
    [handleSubmit]
  );
  return (
    <div className="add-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="Tambah item..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="form-row">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {Object.entries(CATEGORIES).map(([cat, icon]) => (
            <option key={cat} value={cat}>{icon} {cat}</option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="qty-input"
        />
        <button onClick={handleSubmit} className="add-btn">+ Tambah</button>
      </div>
    </div>
  );
}

function FilterTabs() {
  const { filter, setFilter } = useShoppingContext();
  const tabs = useMemo(() => ["Semua", "Belum", "Selesai"], []);

  return (
    <div className="filter-tabs">
      {tabs.map((f) => (
        <button
          key={f}
          className={`tab ${filter === f ? "active" : ""}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function ShoppingItem({ item }) {
  const { toggleItem, deleteItem } = useShoppingContext();

  const handleToggle = useCallback(() => toggleItem(item.id), [item.id, toggleItem]);
  const handleDelete = useCallback(() => deleteItem(item.id), [item.id, deleteItem]);

  return (
    <li className={`item ${item.checked ? "checked" : ""}`}>
      <button className="check-btn" onClick={handleToggle}>
        {item.checked ? "✓" : ""}
      </button>
      <div className="item-info">
        <span className="item-name">{item.name}</span>
        <span className="item-meta">
          {CATEGORIES[item.category]} {item.category} · {item.qty} pcs
        </span>
      </div>
      <button className="delete-btn" onClick={handleDelete}>✕</button>
    </li>
  );
}

function ItemList() {
  const { filteredItems } = useShoppingContext();

  return (
    <ul className="item-list">
      {filteredItems.length === 0 && (
        <li className="empty">Tidak ada item di sini.</li>
      )}
      {filteredItems.map((item) => (
        <ShoppingItem key={item.id} item={item} />
      ))}
    </ul>
  );
}

function ClearButton() {
  const { stats, clearDone } = useShoppingContext();
  if (stats.done === 0) return null;
  return (
    <button className="clear-btn" onClick={clearDone}>
      Hapus yang selesai ({stats.done})
    </button>
  );
}

export default function App() {
  return (
    <ShoppingProvider>
      <div className="app">
        <Header />
        <AddItemForm />
        <FilterTabs />
        <ItemList />
        <ClearButton />
      </div>
    </ShoppingProvider>
  )
}