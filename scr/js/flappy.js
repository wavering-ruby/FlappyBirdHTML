function newElement(tagName, className){
    const elem = document.createElement(tagName);

    elem.className = className;

    return elem;
}

function Collision(updown = false){
    this.element = newElement('div', 'collision');

    const border = newElement('div', 'border');
    const body = newElement('div', 'body');

    // A lógica por trás da ordem é a seguinte:
    /* Quando adicionar a barreira, temos que saber se é a parte de cima (aquela que a tampa
    do cano está virada para baixo ou é ao contrário, por isso da variável updown. 
    Neste caso, quando desenhamos o cano de cima, primeiros adicionamos o corpo (body) e depois a borda (border)
    para o outro tipo de barreira, mudamos o sentido, então no segundo caso, adicionamos a borda (border) e depois o corpo (body)
    */

    this.element.appendChild(updown ? body : border);
    this.element.appendChild(updown ? border : body);

    // Alterando a altura da barreira
    this.setHeight = height => body.style.height = `${height}px`;
}

function pairCollision(height, spaceBetween, x){
    this.element = newElement('div', 'collision-pair');

    this.top = new Collision(true);
    this.bottom = new Collision(false);

    this.element.appendChild(this.top.element); // Add top collision
    this.element.appendChild(this.bottom.element); // Add top collision

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

/*const collision = new pairCollision(450, 150, 100)
document.querySelector('[wm-flappy]').appendChild(collision.element);

const collision2 = new pairCollision(450, 150, 200)
document.querySelector('[wm-flappy]').appendChild(collision2.element);*/

function Collisions(height, width, spaceBetween, spaceCollision, notificationScore){
    // Função para reaproveitar e controlar as colisões

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

            // Para reutilizar uma barreira, a partir do momento que ela sair da tela,
            // ela irá para o final da fila e terá seu espaço entre as colisões sorteadas novamente
            if(pair.getX() < -pair.getWidth()){
                pair.setX(pair.getX() + spaceCollision * this.pairs.length);
                pair.randomSpaceBetween();
            }

            const middle = width / 2;
            const passMiddle = pair.getX() + deslocation >= middle && pair.getX() < middle;

            if(passMiddle){
                notificationScore();
            };
        })
    };
}

function Bird(gameHeight, fallingY, flyingY){
    let flying = false;
    this.element = newElement('img', 'bird');
    this.element.src = './scr/imgs/bird.png';

    this.getY = () => parseInt(this.element.style.bottom.split('px')[0]);
    this.setY = y => this.element.style.bottom = `${y}px`;


    // Quando ele clicar ele irá setar o flying para true, mas depois, apenas vai se desfazer 
    window.onclick = () => {
        flying = true;
        console.log("Flying: ", flying);

        // Após um tempo, redefine para false se não houver outro clique
        setTimeout(() => {
            flying = false;
        }, 200);
    };

    //window.onkeydown = e => flying = true;
    //window.onkeyup = e => flying = false;

    this.animation = () => {
        const newY = this.getY() + (flying ? 8 : -5);
        const maxHeight = gameHeight - this.element.clientHeight;

        if(newY <= 0) {
            this.setY(0);
        } else if(newY >= maxHeight){
            this.setY(maxHeight);
        } else {
            this.setY(newY);
        }
    }

    this.setY(gameHeight / 2);
}

// Teste para colocar para ver as colisões se movendo
const collisions = new Collisions(450, 200, 200, 400, 0);
const bird = new Bird(450, -5, 8);

const gameArea = document.querySelector('[wm-flappy]');
gameArea.appendChild(bird.element);

collisions.pairs.forEach(pair => gameArea.appendChild(pair.element));
setInterval(() => {
    collisions.animation();
    bird.animation();
}, 30);