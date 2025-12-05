import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import ConsoleCommands from './components/ConsoleCommands';

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sortBy, setSortBy] = useState('id');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [useDefaultFile, setUseDefaultFile] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const loadDefaultItems = async () => {
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/Items.json`);
      const data = await response.json();
      setItems(data);
      setSelectedCategory('All');
      setUseDefaultFile(true);
    } catch (error) {
      console.error('Error loading default items:', error);
      alert('Error loading default items');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setItems(data);
        setSelectedCategory('All');
        setUseDefaultFile(false);
      } catch (error) {
        alert('Error reading JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyCommand = async (id, amount = 1) => {
    const commandText = `add_item ${id} ${amount}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(commandText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = commandText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed:', err);
        }

        document.body.removeChild(textarea);
      }

      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Unable to copy command. Please try manually selecting and copying the text.');
    }
  };

  const toggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const uniqueCategories = [...new Set(items.flatMap((item) => item.Categories || []))].sort();
  const allCategories = ['All', ...uniqueCategories];

  const getCategoryCount = (category) => {
    if (category === 'All') return items.length;
    return items.filter((item) => item.Categories?.includes(category)).length;
  };

  const filteredAndSortedItems = items
    .filter((item) => {
      const matchesSearch = item.Title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.Categories?.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.Title.localeCompare(b.Title);
      } else if (sortBy === 'id') {
        return a.ID - b.ID;
      }
      return 0;
    });

  const ItemCard = ({ item }) => {
    const [itemAmount, setItemAmount] = useState(1);
    const formattedId = item.ID?.toString().padStart(3, '0');

    return (
      <div className="panel card p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1">
            <p className="eyebrow text-xs">ID #{formattedId}</p>
            <h2 className="text-xl font-semibold heading-compact">{item.Title}</h2>
          </div>
          <button
            onClick={() => toggleFavorite(item.ID)}
            className={`icon-button ${favorites.includes(item.ID) ? 'active' : ''}`}
            aria-label={favorites.includes(item.ID) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorites.includes(item.ID) ? '★' : '☆'}
          </button>
        </div>

        <p className="text-sm leading-relaxed muted">
          {item.Description || 'No description available.'}
        </p>

        {item.Categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 min-h-[48px]">
            {item.Categories.map((category, idx) => (
              <span
                key={`${category}-${idx}`}
                className={`chip ${category === selectedCategory ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory(category === selectedCategory ? 'All' : category)}
                role="button"
                tabIndex={0}
              >
                {category}
              </span>
            ))}
          </div>
        )}

        <div className="panel panel-strong p-3 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="number"
              value={itemAmount}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!Number.isNaN(value) && value >= 1) setItemAmount(value);
              }}
              className="input-field w-24"
              min="1"
            />
            <div className="flex flex-wrap gap-2">
              {[1, 10, 50, 100].map((num) => (
                <button
                  key={num}
                  onClick={() => setItemAmount(num)}
                  className={`chip ${itemAmount === num ? 'is-active' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <code className="command-code">add_item {item.ID} {itemAmount}</code>
            <button
              onClick={() => handleCopyCommand(item.ID, itemAmount)}
              className={`btn-accent ${copiedId === item.ID ? 'is-success' : ''}`}
            >
              {copiedId === item.ID ? 'Copied' : 'Copy Command'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="stat-pill">
            Value <strong className="text-[var(--text)]">{item.Value}</strong>
          </span>
          {item.Stackable && (
            <span className="stat-pill">
              Stack <strong className="text-[var(--text)]">{item.Stackable}</strong>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        <header className="space-y-3">
          <div className="hud-bar">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border border-[var(--stroke)] bg-[var(--panel-strong)] flex items-center justify-center text-lg heading-compact shadow-inner">
                OS
              </div>
              <div>
                <p className="eyebrow text-xs">Obenseuer / Items</p>
                <h1 className="text-2xl sm:text-3xl heading-brand">Obenseuer Item Manager</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
              <div className="hud-pill">
                Items <span>{items.length || '—'}</span>
              </div>
              <div className="hud-pill">
                Favorites <span>{favorites.length}</span>
              </div>
              <button onClick={() => setIsConsoleOpen(true)} className="btn-ghost whitespace-nowrap">
                &gt;_ Console
              </button>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="icon-button"
                aria-label="Toggle theme"
              >
                {isDarkMode ? '☾' : '☀'}
              </button>
            </div>
          </div>
          <p className="subtitle text-sm sm:text-base max-w-3xl">
            Styled to echo the damp, neon grit of Obenseuer. Load Items.json, browse by category, and copy spawn
            commands without leaving the vibe of the sewers.
          </p>
        </header>

        <section className="panel p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row flex-wrap gap-3">
            <button onClick={loadDefaultItems} className="btn-accent whitespace-nowrap">
              Use Default Items
            </button>

            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="input-field file-input text-sm"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {allCategories.map((category) => (
                <option key={category} value={category}>
                  {category} ({getCategoryCount(category)})
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full"
          />

          {useDefaultFile && <div className="hud-pill w-fit">Using default Items.json</div>}
        </section>

        {favorites.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold heading-compact">Favorites</h2>
              <div className="divider flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items
                .filter((item) => favorites.includes(item.ID))
                .map((item) => (
                  <ItemCard key={item.ID} item={item} />
                ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold heading-compact">All Items</h2>
            <div className="divider flex-1" />
          </div>
          {filteredAndSortedItems.length === 0 ? (
            <div className="panel p-6 text-center muted">
              No items match your filters yet. Load Items.json or adjust search and category filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedItems.map((item) => (
                <ItemCard key={item.ID} item={item} />
              ))}
            </div>
          )}
        </section>

        <Modal isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)}>
          <ConsoleCommands />
        </Modal>
      </div>
    </div>
  );
}

export default App;
