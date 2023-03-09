/*
Club -> Trébol
Diamonds -> Diamantes 
Hearts -> Corazónes
Swords -> Espadas
*/

const blackJack = (()=>{
    'use strict'

    let   playersPoints = [],
          deck          = [];
    const types         = ['C', 'D', 'H', 'S'],
          specials      = ['A', 'J', 'Q', 'K'],
          take          = document.querySelector('#take'),
          divPlayersCards = document.querySelectorAll('.divCards'),
          stop          = document.querySelector('#stop'),
          newgame       = document.querySelector('#new'),
          countPoints   = document.querySelectorAll('small');
        
    //? This function initialize the game
    const initializeGame = ( players = 2 ) => {{
            createDeck();
            playersPoints = [];
            for ( let i = 0 ; i < players ; i++ ) {
                playersPoints.push(0);
            }
            countPoints.forEach( elem => elem.innerText = 0);
            divPlayersCards.forEach ( elem => elem.innerHTML = '');       
            take.disabled = false;
            stop.disabled = false;
        }};

    //? This Function create a new deck
    const createDeck = () =>{
        
        deck = [];
        //? add the cards in the deck
        for (let i = 2; i <= 10 ; i++) {
            for ( let type of types ){
                deck.push(i + type);
            }
        };

        //? add the specials cards in the deck
        for ( let type of types ){
            for ( let special of specials){
                deck.push( special + type );
            }
        };
        //? Using _.shuffle we can change the array positions ramdoly
        return _.shuffle(deck);
    };

    
    

    //? function take a card
    const takeCard = () => {

        /* 
        //? My solution: Create a random number and extract that number index in the array 
        const randomCard = deck[Math.floor(Math.random() * deck.length)];
        deck = deck.filter((card)=> card !== randomCard); 
        console.log(randomCard);
        console.log(deck);
        return randomCard; */
        //? if the deck is empty throw an error
        if (deck.length === 0) {
            throw 'There is no cards in the deck';
        }

        //? store the last card(position) in the array and remove it
        return deck.pop();
    }

    /* takeCard(); */
    const cardValue = (card) => {
        const value = card.substring(0, card.length - 1);
        return (isNaN( value )) ? 
                (value === 'A') ? 11: 10 
                : value * 1;
        /* let points; 
        if ( isNaN(value) ) {
            points = (value === 'A') ? 11 : 10;
        }else {
            points = value * 1;
        } */
    }

    //? 0 = first player, 1 = second player, ... last = Pc Turn
    const gatherPoints = ( card, turn ) => {
        playersPoints[turn] = playersPoints[turn]  + cardValue(card);
        countPoints[turn].innerText = playersPoints[turn];
        return playersPoints[turn];
    };

    const createCard = (card, turn) => {
        const showCard = document.createElement('img');
        showCard.src = `assets/cartas/${card}.png`;
        showCard.classList.add('cards');
        divPlayersCards[turn].append(showCard);
    };

    const winnerMessage = () => {
        
        const [ minimumPoints, pcPoints  ] = playersPoints;
        
        setTimeout(() => {
            
            if (pcPoints === minimumPoints) {
                alert('Draw');
            } else if (minimumPoints > 21){
                alert('Player 2 wins');
            } else if (pcPoints > 21) {
                alert('You win');
            } else if (pcPoints <= 21 && playersPoints[0] <= 21 && pcPoints > playersPoints[0]){
                alert('Player 2 wins')
            } else if (pcPoints < playersPoints[0] && playersPoints[0] <= 21) {
                alert('You win')
            };
            }, 100);
    }

    const pcTurn = ( minimumPoints ) => {
        let pcPoints = 0;
        do {
            const card = takeCard();
            pcPoints = gatherPoints( card, playersPoints.length - 1 );
            createCard( card, playersPoints.length - 1 );
        } while ( ( pcPoints < minimumPoints) && (minimumPoints < 21) );

        winnerMessage();
    };


    // Events
    take.addEventListener('click', () => {
        const card = takeCard();
        const playersPoints = gatherPoints( card, 0);
        createCard(card, 0);

        if (playersPoints > 21) {
            take.disabled = true;
            stop.disabled = true;
            pcTurn(playersPoints);
        } else if (playersPoints === 21 ) {
            take.disabled = true;
            stop.disabled = true;
            pcTurn(playersPoints);
        } 
    });
    stop.addEventListener('click', () => {
        take.disabled = true;
        stop.disabled = true;

        pcTurn(playersPoints[0]);   
    });

    newgame.addEventListener('click', () => { 
        initializeGame();
    });

    return {
        newGame: initializeGame
    };
})();