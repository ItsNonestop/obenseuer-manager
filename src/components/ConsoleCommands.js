import React, { useState } from 'react';

const CommandSection = ({ title, children }) => (
  <div className="panel panel-strong p-4 sm:p-5 space-y-4">
    <div className="flex items-center gap-3">
      <h3 className="text-lg font-semibold heading-compact">{title}</h3>
      <div className="divider flex-1" />
    </div>
    {children}
  </div>
);

const ConsoleCommands = () => {
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
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold heading-brand">Console Commands</h2>
        <p className="subtitle text-sm">
          Tap a preset or assemble custom stat changes, then copy straight to your in-game console.
        </p>
      </div>

      <CommandSection title="Player Stats">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="eyebrow text-xs">Select Stat</label>
            <select
              value={selectedStat}
              onChange={(e) => setSelectedStat(e.target.value)}
              className="w-full input-field"
            >
              <optgroup label="Vital Stats">
                {vitalStats.map((stat) => (
                  <option key={stat.id} value={stat.id}>{stat.label}</option>
                ))}
              </optgroup>
              <optgroup label="Need Stats">
                {needStats.map((stat) => (
                  <option key={stat.id} value={stat.id}>{stat.label}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="eyebrow text-xs">Value</label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <input
                type="number"
                value={statValue}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (!Number.isNaN(value)) setStatValue(value);
                }}
                className="w-24 input-field"
              />
              <div className="flex flex-wrap gap-2">
                {[0, 25, 50, 75, 100].map((num) => (
                  <button
                    key={num}
                    onClick={() => setStatValue(num)}
                    className={`chip ${statValue === num ? 'is-active' : ''}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[var(--stroke)] bg-[var(--panel)]">
            <code className="command-code block">
              player_stats {selectedStat} set {statValue}
            </code>
          </div>

          <button
            onClick={handleStatCommand}
            className={`w-full btn-accent ${copiedCommand ? 'is-success' : ''}`}
          >
            {copiedCommand ? 'Copied!' : 'Copy Command'}
          </button>
        </div>
      </CommandSection>

      <CommandSection title="Quick Toggles">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleCopyCommand('god_mode')}
            className="btn-ghost w-full"
          >
            god_mode
          </button>
          <button
            onClick={() => handleCopyCommand('noclip')}
            className="btn-ghost w-full"
          >
            noclip
          </button>
        </div>
      </CommandSection>
    </div>
  );
};

export default ConsoleCommands;
