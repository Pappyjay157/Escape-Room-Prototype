# Money Heist: Lockdown Protocol

A web-based, point-and-click escape room game inspired by the TV series *Money Heist* and designed using RoomEscapeMaker style.

## 🎯 Core Gameplay

- **Visual Escape Room**: Single-screen layout with interactive objects.
- **Click-Based Interaction**: No typing or programming required.
- **Medium Difficulty**: Logic-focused puzzles that are fun and solvable.
- **Sound Effects**: Optional background music and sound effects for immersion.
- **Cross-Platform**: Works on both mobile and desktop.

## 🧱 UI and Art Requirements

- High-resolution illustrated background.
- Money Heist-themed visuals including Salvador Dalí masks and red jumpsuit characters.
- Dark, vault-like aesthetic with green-tinted lighting.

## 🔐 Interactive Objects

1. **Bookshelf**: Clickable books hiding code clues.
2. **Safe**: Locked with a 4-digit code puzzle.
3. **Couch**: Lifting the pillow reveals a magnifying glass.
4. **Magnifier**: Reveals hidden writing on the safe.
5. **Window**: Triggers police sounds and increases urgency.
6. **AI Terminal**: Optional multiple-choice puzzle.
7. **Vault Door**: Final object to unlock.

## 💻 Tech Stack

- **React + Next.js**: For page rendering.
- **Tailwind CSS**: For rapid layout and styling.
- **Framer Motion**: For smooth animations.
- **Context API**: For managing puzzle progression.

## 📊 Gameplay Mechanics

- **Countdown Timer**: 15 minutes to complete the game.
- **Progress Tracking**: Tracks puzzles solved and hints used.
- **Final Screen**: Displays "Heist Success" or "Caught by Police" with time taken and puzzles solved.

## 🖼️ Assets

- **Dalí Mask**: Reference visual for iconography.
- **Room Background**: Illustrated background with interactive hotspots.
- **Audio**: Ticking clock, alarm, vault click, sirens (optional).

## ✅ Final Notes

- All puzzles are logic-based and clickable.
- No login or user registration needed.
- Hosted on Vercel.
- Mobile-responsive and touchscreen compatible.

## 🛠 Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Pappyjay157/Escape-Room-Prototype.git
   cd Escape-Room-Prototype
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**
Navigate to http://localhost:3000 to view the game.

## 📂 Project Structure

```plaintext
Escape-Room-Prototype/
├── public/
│   ├── images/
│   ├── sounds/
│   └── ...
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── ...
├── package.json
├── README.md
└── ...
```

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request with your changes.

## 📜 License

This project is licensed under the MIT License..