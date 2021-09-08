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
			this.tresor = {
				'red' : 0,
				'pink' : 0,
				'green' : 0,
				'blue' : 0,
				'yellow' : 0,
				'purple' : 0,
				'white' : 0
			};
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
	
	getSchaufenster() {
		return this.getActiveplayer().schaufenster;
	}
	
	getTresor() {
		return this.getActiveplayer().tresor;
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



    doSchaufenster(cards) {
		let schaufenster = this.getSchaufenster();
		if(schaufenster.length == 0 && cards.length == 0) {
			console.log('Schaufenster empty')
		}
		else{
			let newSchaufenster = schaufenster.concat(cards);
			this.getActiveplayer().schaufenster = newSchaufenster;	
		}
    }

    doTresor(card) {
		let tresor = this.getTresor();
		tresor[card] += 1;
		this.gainCoins();
	}
	
	
    doKauf() {}
    doRundenende() {}

	gainCoins() {
		let tresor = this.getTresor();
		let cardTypes = Object.keys(tresor)
		let diversity = this.getCardDiversity(tresor);
		console.log(diversity);
		cardTypes.forEach(card => {
			console.log(tresor[card]);
		})
	}
	
	getCardDiversity(tresor) {
		let diversity = 0;
		Object.keys(tresor).forEach( color => {
			if(tresor[color] > 0){
				diversity += 1;
			}
		})
		return diversity;
	}

}

