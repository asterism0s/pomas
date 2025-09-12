# Pomas - Pomodoro Timer

#### Video Demo: https://youtu.be/5IH23DnPNvo

## Description: 

**Pomas** is a web-based Pomodoro timer application that helps users manage their productivity using the Pomodoro Technique.

The Pomodoro Technique is a method developed  by Francesco Cirillo in the late 1980s. The name "Pomodoro" comes from the tomato-shaped kitchen timer that Cirillo used to time his study periods. Francesco Cirillo created this technique when he was struggling to focus on his studies. He challenged himself to concentrate for just 10 minutes using a kitchen timer. This was so successful that it culminated in him refining the method that we know today as the Pomodoro Technique.

The technique consists of timed work and break periods. A work period is followed by a short break period, which, once finished, is followed again by another work period. This cycle continues for 2 to 4 times, culminating in a longer break. This method improves productivity, focus, concentration. it reduces procrastination and mental burnout.
### How It Works

1. **Start a Session**: Click the play button to begin a work session;
2. **Visual Feedback**: Watch the timer count down and progress bars update in real-time;
3. **Break Time**: When work time ends, automatically transition to a break period;
4. **Customize Settings**: Click the settings icon to adjust timer durations and preferences;
5. **Track Progress**: Monitor completed sessions with the visual counter.

### Main Features

#### Timer Functionality

- **Work Sessions**: Configurable work periods (default 25 minutes)
- **Short Breaks**: Short rest periods between work sessions (default 5 minutes)
- **Long Breaks**: Long rest periods after completing multiple work sessions (default 20 minutes)
- **Automatic Progression**: Seamlessly transitions between work and break periods

#### Visual Design

- Visual timer with retro-style digital display
- **Progress Visualization**: Dynamic progress bars showing time remaining
- **Status Indicators**: Clear visual indicators for work time vs. break time
- **Responsive Design**: Works on both desktop and mobile devices

#### Customization Options

- **Flexible Timer Settings**: Adjust work time (15-30 minutes), short breaks (5-10 minutes), and long breaks (15-25 minutes)
- **Testing Mode**: 1-minute timer options available for quick testing and demonstration purposes
- **Break Intervals**: Configure when long breaks occur (every 2 or 4 completed sessions)
- **Auto-start Options**: Choose whether breaks and work sessions start automatically
- **Sound Control**: Toggle notification sounds on/off

#### User Experience

- **Session Tracking**: Visual counter showing completed Pomodoro sessions
- **Play/Pause/Stop Controls**: Full control over timer state
- **Skip Functionality**: Jump to the next session when needed
- **Audio Notifications**: Sound alerts when sessions complete
- **Toast Messages**: Subtle popup notifications for session transitions
- **Persistent Settings**: User preferences saved in browser storage

### Technical Implementation

#### Technologies Used

- **HTML5**: Semantic and accessible structure
- **CSS3**: Responsive design with gradients and animations
- **JavaScript**: Modular logic with imports/exports
- **Local Storage**: Settings persistence

#### Core Application Files

##### Modular Architecture Choice
I chose a modular JavaScript architecture over a single-file approach for several reasons: it improves code maintainability, enables easier testing and debugging, allows for future expansion without code conflicts. 

##### `index.html` - Application Foundation

The main HTML file serves as the application's structure. With semantic HTML5 elements and with accessibility features. The file contains a fixed header with navigation, the main timer interface with dual visual states (work/break), progress visualization through individual bar elements, and a modal overlay for settings. I chose to use semantic HTML elements like `<main>`, `<article>`, and `<section>` to improve accessibility and SEO. The HTML includes ARIA labels and role attributes to help screen reader compatibility, following guidelines for inclusive design.

##### `timer.js` - Core Logic Engine

This file contains the main application's functionality. It manages all timing logic, state transitions, and user interactions. The module handles multiple concurrent timing operations through `setInterval()`. It manages separate intervals for work sessions, break sessions, and the blinking colon animation. It implements a state management system that tracks current mode (work/short break/long break), completed sessions, and user preferences.

The timer logic includes the functions: `countdownWorkTime()` that manages work session countdown with real-time display updates; `pauseTimeHandler()` which determines whether to trigger short or long breaks based on completed session counts; and `statusDisplay()` that handles visual state transitions without starting timers. I implemented a dual-initialization system where timers can start from either default values or current display time, allowing users to pause and resume sessions seamlessly.

The audio notification system uses the Web Audio API to play completion sounds, with user-configurable sound preferences and a 3-second duration limit to avoid disruption. Error handling ensures the application continues functioning even if audio files fail to load.

##### `settings-modal.js` - Configuration Management

This module manages the user preferences and provides persistent storage through the browser's localStorage. The file handles visibility toggling, forms, and data persistence across browser sessions. It includes getter and setter functions for all configurable options: timer durations, auto-start preferences, sound settings, and break intervals.

I chose localStorage over other storage options like cookies or sessionStorage because it provides persistent storage without server requirements and doesn't impact page load performance.

Each setting includes default values as fallbacks, ensuring the application functions correctly even with corrupted or missing localStorage data.

##### `progress-bar.js` - Visual Feedback System

This module manages the progress visualization using a 60-bar system that provides visual feedback. The `updateProgressBar()` function calculates the appropriate number of active bars based on remaining time and total session duration, using mathematical proportions to ensure accurate representation across different timer lengths.

I implemented a reverse-fill approach where bars deactivate as time progresses, creating a visual metaphor of "time running out."

##### `notifications.js` - User Feedback System

This module handles toast notifications that provide a non-intrusive user feedback for session transitions. I preferred this instead of JavaScript's native `alert()` function because the default alert dialog paused the JavaScript execution, which froze the timer countdown. This was problematic because users would miss the timing if they didn't immediately dismiss the dialog.  The toast notifications solve this, allowing the timer to continue running while still providing visual feedback about session transitions.

The `showToast()` function creates temporary DOM elements with fade-in/fade-out animations, automatically cleaning up after display duration expires. 

#### SASS Architecture Strategy

I chose a modular SASS architecture over traditional single-file CSS because it provides code organization, maintainability, and scalability. 

The SASS enabled features like nested selectors, mathematical operations for responsive spacing, and reusable mixins which reduced code duplication. For example, the button mixin system generated consistent hover, active, and disabled states across all elements, ensuring design consistency.

##### `style.sass` - Design System

I particularly chose to implement the application styles using SASS instead of CSS because it offers several advantages. I modularized all the styles through a simple folder system:

- **Abstracts (tools and helpers):**
    - `breakpoints.scss`: contains the breakpoints that handle the transition of mobile and desktop styles;
    - `colors.scss`: I centralized all design tokens including color palettes, spacing scales, and component states (hover, active, pressed). Which resulted in faster and easier maintenance.
    - `mixins.scss`: Here I created classes dynamically to be inserted directly into HTML, such as paddings, margins, and gaps. This resulted in faster implementation since I could apply spacing directly in HTML without writing custom CSS. I got inspiration on the bootstrap style system to create my own consistent margins and padding scales.
    - `placeholders.scss`: I also made extensive use of placeholders, which served to centralize and declutter style code that was repeated across various classes.
    - `spacing.scss`: I centralized all project spacing into a single variable, which allowed me to reuse it in an organized manner both in mixins and in the project in general.
    - `variables.scss`: a set of variables that determine button states, such as hover and pressed. They store various key-value pairs, used in some mixins, in order to organize and facilitate maintenance.
- **Base (foundation styles):**
    - `base.scss`: Some general style resets.
    - I centralized the fonts used in the project in the `fonts.scss` file. And I also defined their sizes in variables, to facilitate maintenance and use in mixins.
    - In `typography.scss` I defined general typography styles for the project.
- **Components (UI Elements):**
    - `buttons.scss` handles the project's button styles.
    - `play-controls.scss` defines the styles for the pomodoro play button.
    - `settings.scss`: defines the styles for the app's settings modal.
    - `timer.scss`: defines the styles for the timer's digital display.
- **Layout:**
    - `header.scss`: stores the application header styles.
- **Pages:**
    - `home.scss`: contains the basic home styles.


### Visual Design Choices

The retro-digital aesthetic serves both functional and aesthetic purposes. The DSEG7 font family mimics classic digital displays, ensuring readability at all sizes. 
