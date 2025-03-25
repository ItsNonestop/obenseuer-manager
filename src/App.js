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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setItems(data);
        setSelectedCategory('All');
      } catch (error) {
        alert('Error reading JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleCopyCommand = (id, amount = 1) => {
    navigator.clipboard.writeText(`add_item ${id} ${amount}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const uniqueCategories = [...new Set(items.flatMap(item => item.Categories || []))].sort();
  const allCategories = ['All', ...uniqueCategories];

  const getCategoryCount = (category) => {
    if (category === 'All') return items.length;
    return items.filter(item => item.Categories?.includes(category)).length;
  };

  const filteredAndSortedItems = items
    .filter(item => {
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

    return (
      <div 
        className={`rounded-lg shadow-md p-6 transition-all duration-200 flex flex-col ${
          isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {item.Title}
          </h2>
          <button
            onClick={() => toggleFavorite(item.ID)}
            className={`p-1 rounded-full transition-colors text-xl ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            {favorites.includes(item.ID) ? '⭐' : '★'}
          </button>
        </div>
        
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {item.Description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
          {item.Categories?.map((category, idx) => (
            <span 
              key={idx}
              className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 h-fit ${
                category === selectedCategory ?
                  (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') :
                  (isDarkMode ? 'bg-blue-900 text-blue-100 hover:bg-blue-800' : 'bg-blue-100 text-blue-800 hover:bg-blue-200')
              }`}
              onClick={() => setSelectedCategory(category === selectedCategory ? 'All' : category)}
              style={{ cursor: 'pointer' }}
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className={`mb-4 rounded p-3 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={itemAmount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1) setItemAmount(value);
                  }}
                  className={`w-24 p-2 rounded-md ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                  min="1"
                />
                <div className="flex gap-2">
                  {[1, 10, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => setItemAmount(num)}
                      className={`px-3 py-1 rounded ${
                        itemAmount === num
                          ? isDarkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-500 text-white'
                          : isDarkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <code className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  add_item {item.ID} {itemAmount}
                </code>
                <button
                  onClick={() => handleCopyCommand(item.ID, itemAmount)}
                  className={`px-4 py-1 rounded-md transition-all duration-200 ${
                    copiedId === item.ID ?
                      'bg-green-500 text-white' :
                      isDarkMode ?
                        'bg-blue-600 text-white hover:bg-blue-700' :
                        'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {copiedId === item.ID ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Value: {item.Value}</span>
            {item.Stackable && <span className="ml-4">Stack: {item.Stackable}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Obenseuer Items Manager
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsConsoleOpen(true)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              } hover:opacity-80 transition-opacity`}
              title="Console Commands"
            >
              &gt;_
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Controls Section */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-8`}>
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className={`block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                ${isDarkMode ? 
                  'file:bg-blue-600 file:text-white hover:file:bg-blue-700' : 
                  'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'}`}
            />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {allCategories.map(category => (
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
            className={`w-full p-2 rounded-md ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            } border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
          />
        </div>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Favorites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items
                .filter(item => favorites.includes(item.ID))
                .map((item) => (
                  <ItemCard key={item.ID} item={item} />
                ))}
            </div>
            <div className={`w-full h-px mb-8 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </>
        )}

        {/* Main Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedItems.map((item) => (
            <ItemCard key={item.ID} item={item} />
          ))}
        </div>

        {/* Console Commands Modal */}
        <Modal
          isOpen={isConsoleOpen}
          onClose={() => setIsConsoleOpen(false)}
          isDarkMode={isDarkMode}
        >
          <ConsoleCommands isDarkMode={isDarkMode} />
        </Modal>
      </div>
    </div>
  );
}

export default App;
