let cards;
let openCardsTurn = [];
let turns = 0;
let points = 0;

let leaders = [];

let turnCount;
let pointCount;
let startButton;
let modalResult;
let leadersButton;

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
                    CheckEndGame();
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
        leadersButton = document.querySelector(".leaders");

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

function CheckEndGame() {
  if (points!=8)
    return;

    modalResult = document.createElement('div');
      modalResult.className = 'modal-overlay';
      modalResult.innerHTML = `
        <div class="game-result">
            <h1>Конец игры!</h1>
            <h2 class="game-result-turns">Сделано ходов - ${turns}</h2>
            <div class="game-result-buttons">
                <div class="start-result button">Новая игра</div>
                <div class="close-result button">Закрыть</div>
            </div>
        </div>`;

    document.body.append(modalResult);
    let startResultButton = document.querySelector(".start-result");
    let closeResultButton = document.querySelector(".close-result");

    startResultButton.addEventListener('click', (e) => {
        modalResult.remove();
        StartGame();
    });

    closeResultButton.addEventListener('click', (e) => {
        modalResult.remove();
    });

    modalResult.addEventListener('click', (e) => {
        modalResult.remove();
    });

    leaders = JSON.parse(localStorage.getItem('leaders')) || [];
    let leader = {turns: turns, date: Date.now()};


    leaders.push(leader);
    leaders = leaders.sort(compareLeaders).slice(0, 10);

    localStorage.setItem('leaders',  JSON.stringify(leaders));
}

leadersButton.addEventListener('click', (e) => {
    leaders = JSON.parse(localStorage.getItem('leaders')) || [];
    modalResult = document.createElement('div');
      modalResult.className = 'modal-overlay';
      modalResult.innerHTML = `
        <div class="leaders-result">
            <h1>Таблица лидеров</h1>
            <div class="leaders-list">
                ${leaders.length
                ? leaders.sort(compareLeaders).slice(0, 10).map((leader, i) => `
                    <div class="leader-row">
                    <span>${i + 1}.</span>
                    <span>Ходов: ${leader.turns}</span>
                    <span>${new Date(leader.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                `).join('')
                : '<p>Пока нет результатов</p>'}
            </div>
            <div class="game-leaders-buttons">
                <div class="close-leaders button">Закрыть</div>
            </div>
        </div>`;

    document.body.append(modalResult);
    leaders = JSON.parse(localStorage.getItem('leaders')) || [];

    let closeLeadersButton = document.querySelector(".close-leaders");

    closeLeadersButton.addEventListener('click', (e) => {
        modalResult.remove();
    });

    modalResult.addEventListener('click', (e) => {
        modalResult.remove();
    });
});

function compareLeaders(a, b) {
  if (a.turns < b.turns) {
    return -1
  }
  if (a.turns > b.turns) {
    return 1
  }

  if (a.date > b.date)
    return -1;

  if (a.date < b.date)
    return 1;

  return 0
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalResult!=null)
    modalResult.remove();
});