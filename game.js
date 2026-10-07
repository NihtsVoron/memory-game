const cards = document.querySelectorAll(".card");
let openCardsTurn = [];
let turns = 0;
let points = 0;

const turnCount = document.querySelector("#turn-count");
const pointCount = document.querySelector("#point-count");

const startButton = document.querySelector(".start");

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        {
            if (card.classList.contains('flipped') ||
                card.classList.contains('open'))
                    return;

            if (openCardsTurn.length==2)
                CloseFlippedCards();

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

    cards.forEach(card =>{
        card.classList.remove('flipped');
        card.classList.remove('open');
    })

}