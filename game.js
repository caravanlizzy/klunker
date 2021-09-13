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
    constructor(name, id) {
        this.id = id;
        this.name = name;
        this.coins = 0;
        this.hand = [];
        this.schaufenster = [];
        this.cleanTresor();
    }

    cleanTresor() {
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
        this.startingPlayer = 0;
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
        let id = this.players.length;
        let player = new Player(name, id);
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
//         this.shuffleStartingplayer();
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
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            for(let j = player.hand.length; j < 6; j++) {
                player.hand.push(this.pile.pop());
            }
        }
    }

    shuffleStartingplayer(){
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
		this.sellAll(tresor);
	}
	
	
    doKauf(sellerId, kauf = true) {
		let buyer = this.getActiveplayer();
        if (!kauf) {
            this.setStartingplayer(buyer.id);
            console.log('endKauf')
            return true;
        }
        let seller = this.players[sellerId];
        if(buyer.coins == 0 && buyer.id != sellerId) {
            return false;
        }
        let tresor = this.getTresor();
        let schaufenster = this.getSchaufenster();
        buyer.schaufenster = this.addTresor(tresor, schaufenster);
        buyer.cleanTresor();
        pay(buyer, seller);
        return true;
	}

	addTresor(tresor, schaufenster) {
        let colors = Object.keys(tresor);
        for (let c = 0; c < colors.length; c++) {
            let color = colors[c];
            let amount = tresor[color];
            for (let i = 0; i < amount; i++) {
                schaufenster.push(color);
            }
        }
        return schaufenster;
    }

    pay(buyer, seller) {
        buyer.coins -= 1;
        seller.coins += 1;
    }

	sellAll() {
		let cardSet = this.findCompleteTresor();
		while(cardSet){
			this.sellCards(cardSet);
			cardSet = this.findCompleteTresor();
		}
	}

	sellCards(cardType) {
		let tresor = this.getTresor();
		let diversity = this.getCardDiversity(tresor);
		console.log(tresor, diversity);
		if(tresor[cardType] > 3) {
			let player = this.getActiveplayer();
			let coins = Math.max(5-diversity, 1);
			let returnCards = 4-coins;
			player.coins += coins;
			player.tresor[cardType] -= 4;
			this.pile[cardType] += returnCards;
        }
	}
	
        findCompleteTresor() {
		let player = this.getActiveplayer();
		let cardTypes = Object.keys(deck);
		for(let i = 0; i < cardTypes.length; i++) {
			let cardType = cardTypes[i];
			if(player.tresor[cardType] > 3) {
				return cardType;
			}
		}
		return false;
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

	setStartingplayer(playerId) {
        this.startingPlayer = playerId;
    }

    doRundenende() {
        if(this.checkOver) {
            console.log("Game over");
        }
        else{
            this.dealCards();
        }
    }

    checkOver() {
        let cardsLeft = this.pile.length;
        let cardsNeeded = 0;
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            cardsNeeded += 6 - player.hand.length;
        }
        if (cardsNeeded < cardsLeft) {
            return true;
        }
        return false;
    }

}

