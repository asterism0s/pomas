# Pomas - Pomodoro Timer

#### Video Demo: <URL HERE>

#### Description:

Pomas is a web-based Pomodoro timer application that helps users manage their productivity using the Pomodoro Technique:  work for focused intervals, take short breaks, and enjoy longer breaks after completing several work sessions. This approach helps maintain concentration while preventing burnout.

The app features a clean interface with customizable timer settings and visual feedback to keep users focused and motivated.


## Features

### Core Timer Functionality

- **Work Sessions**: Configurable work periods (default 25 minutes)
- **Short Breaks**: Short rest periods between work sessions (default 5 minutes)
- **Long Breaks**: Long rest periods after completing multiple work sessions (default 20 minutes)
- **Automatic Progression**: Seamlessly transitions between work and break periods

### Customization Options

- **Flexible Timer Settings**: Adjust work time (15-30 minutes), short breaks (5-10 minutes), and long breaks (15-25 minutes)
- **Testing Mode**: 1-minute timer options available for quick testing and demonstration purposes
- **Break Intervals**: Configure when long breaks occur (every 2 or 4 completed sessions)
- **Auto-start Options**: Choose whether breaks and work sessions start automatically
- **Sound Control**: Toggle notification sounds on/off

## Technical Implementation

The application is built with vanilla JavaScript using a modular architecture:

- `timer.js`: Core timer logic, session management, and state handling
- `settings-modal.js`: Configuration interface and localStorage management
- `progress-bar.js`: Visual progress tracking system
- `notifications.js`: Toast notification system
- `style.css`: Custom CSS with responsive design

## How It Works

1. **Start a Session**: Click the play button to begin a work session
2. **Visual Feedback**: Watch the timer count down and progress bars update in real-time
3. **Break Time**: When work time ends, automatically transition to a break period
4. **Customize Settings**: Click the settings icon to adjust timer durations and preferences
5. **Track Progress**: Monitor completed sessions with the visual counter

