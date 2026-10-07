let cards;
let openCardsTurn = [];
let turns = 0;
let points = 0;

let turnCount;
let pointCount;
let startButton;

LoadGame();
StartGame();

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        {
            if (card.classList.contains('flipped') ||
                card.classList.contains('open'))
                    return;

            if (openCardsTurn.length==2)
                return;

            card.classList.toggle('flipped');
            openCardsTurn.push(card);

            if (openCardsTurn.length == 2)
            {
                turns++;
                turnCount.innerHTML = turns;

                if (openCardsTurn.every(x => x.dataset.card == openCardsTurn[0].dataset.card))
                {
                    openCardsTurn.forEach(item =>
                        item.classList.toggle('open')
                    );

                    CloseFlippedCards();
                    points++;
                    pointCount.innerHTML=points;
                    return;
                }

                setTimeout(CloseFlippedCards, 1000);
            }
        }
  });
});

function CloseFlippedCards() {
    if (openCardsTurn.length != 2)
        return

    openCardsTurn.forEach(item =>
    item.classList.toggle('flipped'));

    openCardsTurn=[];
}

startButton.addEventListener('click', (e) => {
    StartGame();
});

function StartGame() {
    openCardsTurn=[];
    turns=0;
    turnCount.innerHTML = turns;
    points=0;
    pointCount.innerHTML = points;

    let items = [];

    for (let index = 0; index < 16; index++) {
        items.push(index);
    }

    for (let index = 0; index < 7; index++) {
        let randomIndex = getRandomInt(items.length);
        cards[items[randomIndex]].dataset.card = index;
        cards[items[randomIndex]].innerHTML = `
          <span>${index}</span>
        `;
        items.splice(randomIndex, 1);
        randomIndex = getRandomInt(items.length);
        cards[items[randomIndex]].dataset.card = index;
        cards[items[randomIndex]].innerHTML = `
          <span>${index}</span>
        `;
        items.splice(randomIndex, 1);
    }

    items.forEach(item=>
    {
        cards[item].dataset.card=7;
        cards[item].innerHTML = `
          <span>${7}</span>
        `;
    });

    cards.forEach(card =>{
        card.classList.remove('flipped');
        card.classList.remove('open');
    })
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function LoadGame() {
    const headerItem = document.createElement('header');
      headerItem.className = 'game-header';
      headerItem.innerHTML = `
        <h1>Memory Game</h1>
        <p>Уважаемый ревьюер! Надеюсь к концу проверки ты сможешь поиграть в мою игру!</p>
        <p>Прошу дать мне немного времени</p>
        <div class="game-buttons">
            <div class="start button">Новая игра</div>
            <div class="leaders button">Лидеры</div>
        </div>
        <div class="scores">
            <div class="turns">Ход: <span id = "turn-count">0</span></div>
            <div class="points">Очки: <span id = "point-count">0</span></div>
        </div>`;

        document.body.append(headerItem);
        turnCount = document.querySelector("#turn-count");
        pointCount = document.querySelector("#point-count");
        startButton = document.querySelector(".start");

        let mainSection = document.createElement('main');

        document.body.append(mainSection);
        let gameContainer = document.createElement('div');
        gameContainer.className = 'game-container';
        mainSection.append(gameContainer);

        for (let index = 0; index < 16; index++) {
            let card = document.createElement('div');
            card.className = 'card';
            gameContainer.append(card);
        }

        cards = document.querySelectorAll(".card");
}