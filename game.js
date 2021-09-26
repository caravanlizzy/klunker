const deck = {
    red: 14,
    pink: 14,
    green: 14,
    blue: 14,
    yellow: 12,
    purple: 14,
    grey: 15
}


class Player {
    constructor(name, id) {
        this.id = id;
        this.name = name;
        this.coins = 1;
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
            'grey' : 0
        };
    }
}


class Game {
    constructor() {
        this.phases = ['SCHAUFENSTER', 'TRESOR', 'KAUF', 'RUNDENENDE'];
        this.state = 0; // 0 - idle, 1 - runnning, 2 - over
        this.counter = 0;
        this.activePlayer = 0;
        this.startingPlayer = 0;
        this.players = [];
        this.pile = [];
        this.tresorPasses = [];
        this.graphic = new Graphic();
    }

    runGame() {
        this.setupGame();
        do {this.runRound()}
        while(this.state == 1);
        this.endGame();
    }
    
    runRound() {
        this.counter += 1;
        this.schaufensterPhase();
        this.tresorPhase();
        this.kaufPhase();
        this.doRundenende();   
    }

    setupGame() {
        this.state = 1;
        this.createdrawPile();
        this.shufflePile();
        this.dealCards();
        this.shuffleStartingplayer();
    }
    
    endGame() {
        this.showResults();
    }

    schaufensterPhase() {
        console.log("SCHAUFENSTERPHASE!")
        for(let i = 0; i < this.players.length; i++) {
            let player = this.getActiveplayer();
            this.playRandomschaufenster();
            this.graphic.updateSchaufenster(player.id, player.schaufenster);
            this.nextPlayer();
        }
    }

    tresorPhase() {
        console.log("TRESORPHASE!")
        while(this.tresorPasses.length < this.players.length) {
//             alert('Tresorphase' + this.counter);
            let player = this.getActiveplayer();
            console.log(player.name + ' has ' + player.hand.length + ' cards in its hand.');
            if (player.hand.length == 0 || this.randomPasstresor()) {
                this.doTresor('pass');
            }
            else {
                let cardPos = this.getRandomInt(player.hand.length);
                this.doTresor(player.hand[cardPos]);
                player.hand.splice(cardPos, 1);
            }
            this.nextPlayer();
        }
    }
    
    kaufPhase() {
        console.log("KAUFPHASE!")
        for (let i = 0; i < this.players.length; i++) {
            let player = this.getActiveplayer();
            let kauf = true;
            if (player.schaufenster.length == 0) {
                kauf = this.decideKaufornot();
            }
            if (kauf) {
                let kaufDone = false;
                while (!kaufDone) {
                    let sellerId = this.getRandomInt(this.players.length);
                    kaufDone = this.doKauf(sellerId);
                    if(kaufDone == 'endkauf') {
                        break;
                        console.log("Kauf ended vorzeitig.")
                    }
                }

            }
            this.nextPlayer();
        }
    }
    
    decideKaufornot() {
        return this.randomKaufornot();
    }
    
    randomKaufornot() {
        if (Math.random() < 0.5) {
            return true;
        }
        return false;
    }

    randomPasstresor() {
        if (Math.random() < 0.25) {
            return true;
        }
        return false;
    }

    nextPlayer () {
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
//         console.log('It is ' + this.players[this.activePlayer].name + ' turn now.');
    }


    addPlayer(name) {
        let id = this.players.length;
        let player = new Player(name, id);
        this.players.push(player);
        this.graphic.drawPlayer(id, name);
        this.graphic.updateCoins(id, player.coins);
    }

    getActiveplayer() {
        return this.players[this.activePlayer];
    }

	getTresor() {
		return this.getActiveplayer().tresor;
	}

	getHand() {
        return this.getActiveplayer().hand;
    }

    getSchaufenster() {
		return this.getActiveplayer().schaufenster;
	}

    setStartingplayer(playerId) {
        this.startingPlayer = playerId;
    }

	playRandomschaufenster() {
        let hand = this.getHand();
        let amount = this.getRandomInt(hand.length, 1);
        for (let i = 0; i < amount; i++) {
            let randInt = this.getRandomInt(hand.length - 1);
            let card = hand.splice(randInt, 1)[0];
            console.log(this.getActiveplayer().name + ' adds ' + card + ' to its Schaufenster');
            this.getSchaufenster().push(card);
            this.graphic.updateHandCard(this.getActiveplayer().id, randInt, 'white');
        }
    }

    doSchaufenster(cards) {
		let schaufenster = this.getSchaufenster();
		if(schaufenster.length == 0 && cards.length == 0) {
			console.log('Schaufenster empty');
		}
		else{
			let newSchaufenster = schaufenster.concat(cards);
			this.getActiveplayer().schaufenster = newSchaufenster;
		}
    }
    
    clearSchaufenster(playerId) {
        let player = this.players[playerId];
        player.schaufenster = [];
    }
    
    doTresor(card) {
        let player = this.getActiveplayer();
        if (this.tresorPasses.includes(player)) {
            console.log(player.name + ' has already passed and is skipped.')
            return;
        }
        if (card == 'pass') {
            console.log(player.name + ' passes for the tresorphase.')
            this.tresorPasses.push(player);
            return;
        }
		let tresor = this.getTresor();
		tresor[card] += 1;
        console.log(player.name + ' adds a ' + card + 'card to the Tresor.')
        this.graphic.updateTresorCard(player.id, card, tresor[card]);
		this.sellAll(tresor);
	}
	
    doKauf(sellerId) {
		let buyer = this.getActiveplayer();
        let seller = this.players[sellerId];
        if(buyer.coins == 0 && buyer.id != sellerId) {
            console.log("Please buy your own Schaufenster!")
            return false;
        }
        console.log(seller.name + 's Schaufenster is: ' + seller.schaufenster);
        if(seller.schaufenster.length == 0) {
            if(seller.id == buyer.id) {
                return 'endkauf'
            }
            return false;
        }
        console.log(buyer.name  + ' buys schaufenster of ' + seller.name);
        let tresor = this.getTresor();
        let schaufenster = this.getSchaufenster();
        let sellerSchaufenster = this.players[seller.id].schaufenster;
        for(let i = 0; i < sellerSchaufenster.length; i++) {
            let card = sellerSchaufenster[i];
            buyer.tresor[card] += 1;
            this.graphic.updateTresorCard(buyer.id, card, tresor[card]);
        }
        this.clearSchaufenster(seller.id);
        this.graphic.updateSchaufenster(seller.id, seller.schaufenster);
        this.pay(buyer, seller);
        this.sellAll();
        return true;
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
//         for(let i = 0; i < this.players.length; i++) {
//             console.log(this.players[i].name + ' needs ' + (6 - this.players[i].hand.length) + 'cards.' );
//         }
//         console.log('pile length is: ' + this.pile.length);
//         
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            for(let j = player.hand.length; j < 6; j++) {
                let card = this.pile.pop();
                player.hand.push(card);
                this.graphic.updateHandCard(player.id, j, card);
            }
        }
//         console.log('pile length is: ' + this.pile.length);

    }

    shuffleStartingplayer(){
        this.activePlayer = Math.floor(Math.random() * this.players.length);
    }


    pay(buyer, seller) {
        buyer.coins -= 1;
        seller.coins += 1;
        this.graphic.updateCoins(buyer.id, buyer.coins);
        this.graphic.updateCoins(seller.id, seller.coins);
    }

	sellAll() {
		let cardSet = this.findCompleteTresor();
		while(cardSet){
			this.sellCards(cardSet);
			cardSet = this.findCompleteTresor();
		}
	}

	sellCards(card) {
		let tresor = this.getTresor();
		let diversity = this.getCardDiversity(tresor);
		if(tresor[card] > 3) {
			let player = this.getActiveplayer();
			let coins = Math.max(5-diversity, 1);
            console.log('Selling ' + card + ' for ' + coins);
            let returnCards = 4-coins;
			player.coins += coins;
			player.tresor[card] -= 4;
            this.graphic.updateTresorCard(player.id, card, player.tresor[card]);
            this.returnCard(card,returnCards)
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
	
	returnCard(card, amount = 1) {
        for(let i = 0; i < amount; i++) {
            this.pile.push(card);
        }
    }

    doRundenende() {
        console.log("RUNDENENDE");
        if(this.checkOver()) {
            this.state = 2;
        }
        else{
            this.dealCards();
        }
    }
    
    showResults() {
        console.log('Game over after ' + this.counter + ' rounds.');
    }

    checkOver() {
        let cardsLeft = this.pile.length;
        let cardsNeeded = 0;
        console.log(cardsLeft);
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            cardsNeeded += 6 - player.hand.length;
        }
        if (cardsNeeded > cardsLeft) {
            return true;
        }
        return false;
    }

    getRandomInt(amount, offset = 0) {
        return Math.floor(Math.random() * amount + offset);
    }

}
