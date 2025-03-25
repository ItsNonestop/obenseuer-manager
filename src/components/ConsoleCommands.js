import React, { useState, useEffect, useMemo } from 'react';

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
  const [copiedId, setCopiedId] = useState(null);

  const zeroDefaultStats = useMemo(() => [
    'hunger',
    'thirst',
    'tiredness',
    'bladder',
    'depression',
    'alchohol_need',
    'mushroom_need',
    'smoking_need'
  ], []);

  const vitalStats = useMemo(() => [
    { id: 'health', label: 'Health' },
    { id: 'hunger', label: 'Hunger' },
    { id: 'thirst', label: 'Thirst' },
    { id: 'tiredness', label: 'Tiredness' },
    { id: 'hygiene', label: 'Hygiene' }
  ], []);

  const needStats = useMemo(() => [
    { id: 'bladder', label: 'Bladder' },
    { id: 'depression', label: 'Depression' },
    { id: 'alchohol_need', label: 'Alcohol Need' },
    { id: 'mushroom_need', label: 'Mushroom Need' },
    { id: 'smoking_need', label: 'Smoking Need' }
  ], []);

  useEffect(() => {
    setStatValue(zeroDefaultStats.includes(selectedStat) ? 0 : 100);
  }, [selectedStat, zeroDefaultStats]);

  const handleCopyCommand = (command, id) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatCommand = () => {
    const command = `player_stats ${selectedStat} set ${statValue}`;
    handleCopyCommand(command, 'stat_command');
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
            <div className="flex items-center gap-4">
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
              <div className="flex gap-2">
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
              copiedId === 'stat_command'
                ? 'bg-green-500 text-white'
                : isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {copiedId === 'stat_command' ? 'Copied!' : 'Copy Command'}
          </button>
        </div>
      </CommandSection>

      <CommandSection title="God Mode" isDarkMode={isDarkMode}>
        <button
          onClick={() => handleCopyCommand('god_mode', 'god_mode')}
          className={`w-full p-3 rounded-md font-medium transition-colors ${
            copiedId === 'god_mode'
              ? 'bg-green-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {copiedId === 'god_mode' ? 'Copied!' : 'god_mode'}
        </button>
      </CommandSection>

      <CommandSection title="No Clip" isDarkMode={isDarkMode}>
        <button
          onClick={() => handleCopyCommand('noclip', 'noclip')}
          className={`w-full p-3 rounded-md font-medium transition-colors ${
            copiedId === 'noclip'
              ? 'bg-green-500 text-white'
              : isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {copiedId === 'noclip' ? 'Copied!' : 'noclip'}
        </button>
      </CommandSection>
    </div>
  );
};

export default ConsoleCommands;
