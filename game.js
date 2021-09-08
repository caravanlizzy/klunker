const deck = {
    red: 14,
    pink: 14,
    green: 14,
    blue: 14,
    yellow: 12,
    purple: 14,
    white: 15
}


class Player {
    constructor(name) {
            this.name = name;
            this.coins = 0;
            this.hand = [];
            this.schaufenster = [];
    }
}

class Game {
    constructor() {
        this.phases = ['SCHAUFENSTER', 'TRESOR', 'KAUF', 'RUNDENENDE'];
        this.currentPhase = 0;
        this.activePlayer = 0;
        this.players = [];
        this.pile = [];
    }

    nextPlayer () {
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
    }

    nextPhase() {
        this.currentphase = (this.currentPhase + 1) % this.players.length;
    }

    addPlayer(name) {
        let player = new Player(name);
        this.players.push(player);
    }

    getActiveplayer() {
        return this.players[this.activePlayer];
    }

    setupGame() {
        this.createdrawPile();
        this.shufflePile();
        this.dealCards();
        this.getStartingplayer();
    }

    createdrawPile(){
        let entries = Object.entries(deck);
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            for (let j = 0; j < entry[1]; j++ ) {
                this.pile.push(entry[0]);
            }
        }
    }

    shufflePile(iters = 200) {
        for (let i = this.pile.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = this.pile[i];
            this.pile[i] = this.pile[j];
            this.pile[j] = temp;
        }
    }

    dealCards(){
        console.log(this.players.length);
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            for(let j = player.hand.length; j < 6; j++) {
                player.hand.push(this.pile.pop());
            }
        }
    }

    getStartingplayer(){
        this.activePlayer = Math.floor(Math.random() * this.players.length);
    }



    run() {
        this.doSchaufenster();
        this.doTresor();
        this.doKauf();
        this.doRundenende();
    }

    doSchaufenster() {
        this.players.forEach(
            player => this.getInput();
        )
    }



    doTresor() {}
    doKauf() {}
    doRundenende() {}

}

