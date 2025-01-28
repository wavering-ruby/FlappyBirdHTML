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

const b = new pairCollision(450, 200, 800);
document.querySelector('[wm-flappy]').appendChild(b.element);
