QuickQual is a dual-window reflex and coordination game combining Flappy Mode and Bounce Mode. Players must multitask between guiding a bird through obstacles and keeping a ball from falling. Scoring is based on survival and accuracy, testing hand–eye coordination, focus, and reaction speed in a fun, competitive way.

src/
├── core/
│   ├── Game.js            ← gameLoop, start/pause/end
│   ├── State.js           ← MENU / TUTORIAL / PLAYING / PAUSED
│   └── Timer.js           ← GAME_DURATION, timeRemaining
│
├── games/
│   ├── flappy/
│   │   ├── FlappyGame.js
│   │   ├── Bird.js
│   │   └── Pipes.js
│   │
│   └── reflex/
│       ├── ReflexGame.js
│       ├── Ball.js
│       └── Paddle.js
│
├── ui/
│   ├── Menu.js
│   ├── Tutorial.js
│   ├── PauseMenu.js
│   └── HUD.js
│
├── services/
│   └── leaderboard.js     ← Firebase ONLY
│
├── utils/
│   ├── Input.js
│   ├── FloatingText.js
│   └── Constants.js
│
└── main.js
