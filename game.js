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
                turnCount.textContent = turns;

                if (openCardsTurn.every(x => x.dataset.card == openCardsTurn[0].dataset.card))
                {
                    openCardsTurn.forEach(item =>
                        item.classList.toggle('open')
                    );

                    CloseFlippedCards();
                    points++;
                    pointCount.textContent=points;
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
    turnCount.textContent = turns;
    points=0;
    pointCount.textContent = points;

    let items = [];

    for (let index = 0; index < 16; index++) {
        items.push(index);
    }

    for (let index = 0; index < 7; index++) {
        let randomIndex = getRandomInt(items.length);
        cards[items[randomIndex]].dataset.card = index;
        let cardSpan = document.createElement('span');
        cardSpan.textContent = index;
        cards[items[randomIndex]].replaceChildren(cardSpan);

        items.splice(randomIndex, 1);
        randomIndex = getRandomInt(items.length);
        cards[items[randomIndex]].dataset.card = index;
        cardSpan = document.createElement('span');
        cardSpan.textContent = index;
        cards[items[randomIndex]].replaceChildren(cardSpan);
        items.splice(randomIndex, 1);
    }

    items.forEach(item=>
    {
        cards[item].dataset.card=7;
        let cardSpan = document.createElement('span');
        cardSpan.textContent = 7;
        cards[item].replaceChildren(cardSpan);
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

    let h1 = document.createElement('h1');
    h1.textContent ='Memory Game';
    headerItem.append(h1);

    let gameButtons = document.createElement('div');
    gameButtons.className = 'game-buttons';
    headerItem.append(gameButtons);

    startButton = document.createElement('div');
    startButton.className = 'start button';
    startButton.textContent ='Новая игра';
    gameButtons.append(startButton);

    leadersButton = document.createElement('div');
    leadersButton.className = 'leaders button';
    leadersButton.textContent ='Лидеры';
    gameButtons.append(leadersButton);

    let scores = document.createElement('div');
    scores.className = 'scores';
    headerItem.append(scores);

    turnDiv = document.createElement('div');
    turnDiv.className = 'turns';
    turnDiv.textContent ='Ход: ';
    scores.append(turnDiv);

    pointDiv = document.createElement('div');
    pointDiv.className = 'points';
    pointDiv.textContent ='Очки: ';
    scores.append(pointDiv);

    turnCount = document.createElement('span');
    turnCount.id ='turn-count';
    turnDiv.append(turnCount);

    pointCount = document.createElement('span');
    pointCount.id ='turn-count';
    pointDiv.append(pointCount);
    document.body.append(headerItem);

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

    let gameResult = document.createElement('div');
    gameResult.className = 'game-result';
    modalResult.append(gameResult);

    let h1 = document.createElement('h1');
    h1.textContent ='Конец игры!';
    gameResult.append(h1);

    let h2 = document.createElement('h2');
    h2.textContent =`Сделано ходов - ${turns}`;
    gameResult.append(h2);

    let gameResultButtons = document.createElement('div');
    gameResultButtons.className = 'game-result-buttons';
    gameResult.append(gameResultButtons);

    startResultButton = document.createElement('div');
    startResultButton.className = 'start-result button';
    startResultButton.textContent ='Новая игра';
    gameResultButtons.append(startResultButton);

    closeResultButton = document.createElement('div');
    closeResultButton.className = 'close-result button';
    closeResultButton.textContent ='Закрыть';
    gameResultButtons.append(closeResultButton);

    document.body.append(modalResult);

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

    let leadersResult = document.createElement('div');
    leadersResult.className = 'leaders-result';
    modalResult.append(leadersResult);

    let h1 = document.createElement('h1');
    h1.textContent = 'Таблица лидеров';
    leadersResult.append(h1);

    let leadersList = document.createElement('div');
    leadersList.className = 'leaders-list';
    leadersResult.append(leadersList);

    if (leaders.length) {
        leaders.sort(compareLeaders).slice(0, 10).forEach((leader, i) => {
            let leaderRow = document.createElement('div');
            leaderRow.className = 'leader-row';
            leadersList.append(leaderRow);

            let numberSpan = document.createElement('span');
            numberSpan.textContent = `${i + 1}.`;
            leaderRow.append(numberSpan);

            let turnsSpan = document.createElement('span');
            turnsSpan.textContent = `Ходов: ${leader.turns}`;
            leaderRow.append(turnsSpan);

            let dateSpan = document.createElement('span');
            dateSpan.textContent = new Date(leader.date).toLocaleDateString('ru-RU');
            leaderRow.append(dateSpan);
        });
    } else {
        let emptyText = document.createElement('p');
        emptyText.textContent = 'Пока нет результатов';
        leadersList.append(emptyText);
    }

    let gameLeadersButtons = document.createElement('div');
    gameLeadersButtons.className = 'game-leaders-buttons';
    leadersResult.append(gameLeadersButtons);

    let closeLeadersButton = document.createElement('div');
    closeLeadersButton.className = 'close-leaders button';
    closeLeadersButton.textContent = 'Закрыть';
    gameLeadersButtons.append(closeLeadersButton);

    document.body.append(modalResult);

    document.body.append(modalResult);
    leaders = JSON.parse(localStorage.getItem('leaders')) || [];

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