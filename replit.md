# F1 Reaction Race 🏎️

## Overview
F1 Reaction Race is a browser-based reaction time game that simulates the Formula 1 race start sequence. Players test their reflexes by reacting as quickly as possible when the F1 start lights go out, just like professional F1 drivers do at the start of a race.

## Project Type
Static web application (HTML, CSS, JavaScript)

## Project Structure
```
.
├── index.html           # Main HTML page
├── assets/
│   ├── css/
│   │   └── style.css    # All styling
│   ├── js/
│   │   └── game.js      # Game logic and interactions
│   ├── images/          # Favicons and graphics
│   └── sounds/          # Audio effects (click, lights)
├── LICENSE
└── replit.md            # This file
```

## Features
- **F1 Start Light Simulation**: Authentic 5-column F1 start light sequence
- **Reaction Time Tracking**: Records and displays reaction times in milliseconds
- **Leaderboard System**: Tracks top 10 fastest times
- **Jump Start Detection**: Penalizes early clicks, just like in real F1
- **Performance Ratings**: Compares your time to F1 driver standards
- **Responsive Design**: Works on desktop and mobile devices

## How It Works
1. Player clicks "CLICK TO START"
2. Red lights turn on column by column (5 columns, 3 lights each)
3. After a random delay (1-3 seconds), all lights go out
4. Player must click as fast as possible
5. Reaction time is recorded and added to the leaderboard

## Technical Details
- **No Backend**: Purely client-side application
- **No Build Process**: Runs directly in the browser
- **Local Storage**: Leaderboard data is stored in browser (note: current implementation doesn't persist between sessions)
- **Server**: Uses Python's built-in HTTP server for development

## Development
The app runs on port 5000 using Python's HTTP server:
```bash
python -m http.server 5000
```

## Deployment
Configured for Replit Autoscale deployment, which is ideal for static websites:
- **Deployment Type**: Autoscale (stateless web app)
- **Run Command**: `python -m http.server`
- **No Build Step Required**

## Recent Changes
- **2025-10-29**: Initial import and Replit setup
  - Installed Python 3.11 for HTTP server
  - Configured workflow to serve on port 5000
  - Added deployment configuration
  - Created .gitignore for Python environment

## Future Enhancement Ideas
- Add persistent leaderboard using localStorage
- Add sound effects (already have audio files in assets/sounds)
- Add difficulty levels (shorter/longer delays)
- Add multiplayer mode
- Track average reaction time over multiple attempts
- Add themes or customization options

## Performance Benchmarks
According to the game:
- < 150ms: Superhuman! 🔥
- 150-200ms: F1 Driver Level! ⚡
- 200-250ms: Amazing Reflexes! 🏎️
- 250-300ms: Great Start! 👍
- 300-400ms: Good Reaction! 😊
- > 400ms: Keep Practicing! 🐌

Professional F1 drivers typically react in 150-200ms!
