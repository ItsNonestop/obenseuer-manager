import React, { useState } from 'react';

const CommandSection = ({ title, children, isDarkMode }) => (
  <div className={`mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const ConsoleCommands = ({ isDarkMode }) => {
  const [selectedStat, setSelectedStat] = useState('health');
  const [statValue, setStatValue] = useState(100);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const vitalStats = [
    { id: 'health', label: 'Health' },
    { id: 'hunger', label: 'Hunger' },
    { id: 'thirst', label: 'Thirst' },
    { id: 'tiredness', label: 'Tiredness' },
    { id: 'hygiene', label: 'Hygiene' }
  ];

  const needStats = [
    { id: 'bladder', label: 'Bladder' },
    { id: 'depression', label: 'Depression' },
    { id: 'alchohol_need', label: 'Alcohol Need' },
    { id: 'mushroom_need', label: 'Mushroom Need' },
    { id: 'smoking_need', label: 'Smoking Need' }
  ];

  const handleCopyCommand = async (command) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(command);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = command;
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
      
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Unable to copy command. Please try manually selecting and copying the text.');
    }
  };

  const handleStatCommand = () => {
    const command = `player_stats ${selectedStat} set ${statValue}`;
    handleCopyCommand(command);
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Console Commands
      </h2>

      <CommandSection title="Player Stats" isDarkMode={isDarkMode}>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Select Stat</label>
            <select
              value={selectedStat}
              onChange={(e) => setSelectedStat(e.target.value)}
              className={`w-full p-2 rounded-md ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <optgroup label="Vital Stats">
                {vitalStats.map(stat => (
                  <option key={stat.id} value={stat.id}>{stat.label}</option>
                ))}
              </optgroup>
              <optgroup label="Need Stats">
                {needStats.map(stat => (
                  <option key={stat.id} value={stat.id}>{stat.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>Value</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="number"
                value={statValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) setStatValue(value);
                }}
                className={`w-24 p-2 rounded-md ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              />
              <div className="flex flex-wrap gap-2">
                {[0, 25, 50, 75, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => setStatValue(num)}
                    className={`px-3 py-1 rounded ${
                      statValue === num
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
          </div>

          <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <code className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
              player_stats {selectedStat} set {statValue}
            </code>
          </div>

          <button
            onClick={handleStatCommand}
            className={`w-full p-3 rounded-md font-medium transition-colors ${
              copiedCommand
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {copiedCommand ? 'Copied!' : 'Copy Command'}
          </button>
        </div>
      </CommandSection>

      <CommandSection title="God Mode" isDarkMode={isDarkMode}>
        <button
          onClick={() => handleCopyCommand('god_mode')}
          className={`w-full p-3 rounded-md ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          god_mode
        </button>
      </CommandSection>

      <CommandSection title="No Clip" isDarkMode={isDarkMode}>
        <button
          onClick={() => handleCopyCommand('noclip')}
          className={`w-full p-3 rounded-md ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          noclip
        </button>
      </CommandSection>
    </div>
  );
};

export default ConsoleCommands;
