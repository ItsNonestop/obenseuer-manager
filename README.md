# Obenseuer Manager

A web utility for managing Obenseuer game items and console commands. This tool simplifies the process of retrieving item commands and managing player stats.

## Features

- **Item Management**
  - Search and filter items
  - Copy item commands (`add_item`) with correct formatting
  - Categorized item display
  - Favorite items system

- **Player Stats Management**
  - Modify vital stats (Health, Hunger, Thirst, etc.)
  - Adjust addiction levels
  - Quick value presets (0, 25, 50, 75, 100)

- **Game Commands**
  - God Mode toggle
  - No Clip toggle

## How to Use

1. **Items**
   - Upload your `Items.json` file
   - Search for items using the search bar
   - Click categories to filter items
   - Click the copy button to copy item commands
   - Star items to add them to favorites

2. **Player Stats**
   - Select a stat from the dropdown
   - Use preset values or enter custom amounts
   - Copy and paste commands into the game

## Installation

```bash
# Clone the repository
git clone https://github.com/ItsNonestop/obenseuer-manager.git

# Install dependencies
npm install

# Start the development server
npm start
