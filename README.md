# Flappy Bird Game

This project is a browser-based implementation of the classic Flappy Bird game. The code is written in JavaScript and includes features such as collision detection, scoring, and a game loop.

---

## Features
- Dynamic bird animation with gravity and user input for flying.
- Randomly generated pipes with adjustable spacing and difficulty.
- Collision detection between the bird and pipes.
- Real-time score tracking and display.
- Game over logic with an option to restart.

---

## How It Works
The game consists of the following main components:

### 1. **`newElement` Function**
```javascript
function newElement(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}
```
Creates a new HTML element with a specified tag and class.

---

### 2. **`Collision` Class**
```javascript
function Collision(updown = false) {
    this.element = newElement('div', 'collision');

    const border = newElement('div', 'border');
    const body = newElement('div', 'body');

    this.element.appendChild(updown ? body : border);
    this.element.appendChild(updown ? border : body);

    this.setHeight = height => body.style.height = `${height}px`;
}
```
Represents a single pipe (collision element). Handles dynamic height and orientation.

---

### 3. **`pairCollision` Class**
```javascript
function pairCollision(height, spaceBetween, x) {
    this.element = newElement('div', 'collision-pair');
    this.top = new Collision(true);
    this.bottom = new Collision(false);

    this.element.appendChild(this.top.element);
    this.element.appendChild(this.bottom.element);

    this.randomSpaceBetween = () => {
        const topHeight = Math.random() * (height - spaceBetween);
        const bottomHeight = height - spaceBetween - topHeight;
        this.top.setHeight(topHeight);
        this.bottom.setHeight(bottomHeight);
    };

    this.getX = () => parseInt(this.element.style.left.split('px')[0]);
    this.setX = x => this.element.style.left = `${x}px`;
    this.getWidth = () => this.element.clientWidth;

    this.randomSpaceBetween();
    this.setX(x);
}
```
Manages a pair of pipes (top and bottom) and their positioning.

---

### 4. **`checkingOverlapping` Function**
```javascript
function checkingOverlapping(elementA, elementB) {
    const a = elementA.getBoundingClientRect();
    const b = elementB.getBoundingClientRect();

    const cHor = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const cVer = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return cHor && cVer;
}
```
Checks if two elements are overlapping, used for collision detection.

---

### 5. **`Collisions` Class**
```javascript
function Collisions(height, width, spaceBetween, spaceCollision, notificationScore) {
    this.pairs = [
        new pairCollision(height, spaceBetween, width),
        new pairCollision(height, spaceBetween, width + spaceCollision),
        new pairCollision(height, spaceBetween, width + spaceCollision * 2),
        new pairCollision(height, spaceBetween, width + spaceCollision * 3)
    ];

    const deslocation = 5;

    this.animation = () => {
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - deslocation);

            if (pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + spaceCollision * this.pairs.length);
                pair.randomSpaceBetween();
            }

            const middle = width / 2;
            const passMiddle = pair.getX() + deslocation >= middle && pair.getX() < middle;

            if (passMiddle) {
                notificationScore();
            }
        });
    };
}
```
Handles all pipe pairs and their movement. Reuses pipes when they leave the screen.

---

### 6. **`Bird` Class**
```javascript
function Bird(gameHeight) {
    let flying = false;
    this.element = newElement('img', 'bird');
    this.element.src = './scr/imgs/bird.png';

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => this.element.style.bottom = `${y}px`;

    window.onclick = () => {
        flying = true;
        setTimeout(() => flying = false, 100);
    };

    this.animation = () => {
        const newY = this.getY() + (flying ? 10 : -5);
        const maxHeight = gameHeight - this.element.clientHeight;

        if (newY <= 0) {
            this.setY(0);
        } else if (newY >= maxHeight) {
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }
    };

    this.setY(gameHeight / 2);
}
```
Represents the bird and handles its animation and user input.

---

### 7. **`Progress` Class**
```javascript
function Progress() {
    this.element = newElement('span', 'progress');
    this.updateScore = score => this.element.innerHTML = score;
    this.updateScore(0);
}
```
Displays and updates the player's score.

---

### 8. **`FlappyBird` Class**
```javascript
function FlappyBird() {
    let score = 0;

    const gameArea = document.querySelector('[wm-flappy]');
    const height = gameArea.clientHeight;
    const width = gameArea.clientWidth;

    const progress = new Progress();
    const collisions = new Collisions(height, width, 200, 400, () => progress.updateScore(++score));

    const bird = new Bird(height);

    gameArea.appendChild(bird.element);
    gameArea.appendChild(progress.element);
    collisions.pairs.forEach(pair => gameArea.appendChild(pair.element));

    this.start = () => {
        const timer = setInterval(() => {
            collisions.animation();
            bird.animation();

            if (checkingCollision(bird, collisions)) {
                clearInterval(timer);
                if (confirm("Game Over! Want to play again?")) {
                    location.reload();
                }
            }
        }, 30);
    };
}

new FlappyBird().start();
```
Manages the entire game logic, including the game loop, collision checks, and restarting the game.

---

## How to Run
1. Clone the repository or download the source code.
2. Open the `index.html` file in a browser.
3. The game will automatically start and you can click to control the bird's movement (up and down).

---

## Customization
- Adjust the spacing and difficulty by modifying the `spaceBetween` and `spaceCollision` parameters in the `FlappyBird` class.
- Update the bird's movement speed and gravity in the `Bird` class.
