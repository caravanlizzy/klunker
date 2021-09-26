class Graphic {
	//TODO: TRESOR: tile cards and print number just small. SCHAUFENSTER: make it look like schaufenster, HAND: reveal only own cards, PLAYER: show the buy state (1 2 3 4 5 6)
	constructor() {
		this.colors = ['red', 'pink', 'green', 'blue', 'yellow', 'purple', 'grey'];
	}
    
    getDisplay() {
        return document.getElementById("display");
    }
    
    drawTableau(playerId) {
        let tableau = document.createElement('div');
        let className = 'tableau';
        tableau.className = className;
        tableau.id = className + playerId;
        this.getDisplay().append(tableau);
    }
    
    getTableau(playerId) {
        return document.getElementById('tableau' + playerId);
    }
    
    drawSchaufenster(playerId) {
        let schaufenster = document.createElement('div');
        let className = 'schaufenster';
        schaufenster.id = className + playerId;
		schaufenster.className = className;
		this.getArea(playerId).append(schaufenster);
		this.drawTextBar(schaufenster, playerId, 'Schaufenster');
    }
    
    updateSchaufenster(playerId, cards) {
		let tresor = document.getElementById('schaufenster' + playerId);
		while(tresor.childNodes.length > 1) {
			tresor.removeChild(tresor.lastChild);
		}
		let gap = 8;
		for (let i = 0; i < cards.length; i++) {
			let card = cards[i];
			this.drawSchaufensterCard(playerId, card, gap*i, 1.4*gap*i)
		}
	}
	
	drawSchaufensterCard(playerId, color, xPos, yPos) {
		let card = document.createElement('div');
		let className = 'card';
		card.className = className + ' stacking-card card-' + color;
		card.style.left = xPos + 'px';
		card.style.bottom = yPos + 'px';
		document.getElementById('schaufenster' + playerId).append(card);
	}
	
    drawTresor(playerId) {
        let tresor = document.createElement('div');
        let className = 'tresor';
        tresor.id = className + playerId;
        tresor.className = className;
        this.getArea(playerId).append(tresor);
        this.drawTextBar(tresor, playerId, 'Tresor');
		for(let i = 0; i < this.colors.length; i++) {
			let color = this.colors[i];
			this.drawTresorCard(playerId, color);
		}
    }
	
	drawTresorCard(playerId, color) {
		let card = document.createElement('div');
		let className = 'card';
		card.className = className + ' card-' + color;
		card.id = 'tresor' + className + playerId + color;
		card.innerHTML = 0;
		document.getElementById('tresor' + playerId).append(card);
	}
    
    updateTresorCard(playerId, color, value) {
        document.getElementById('tresorcard' + playerId + color).innerHTML = value;
	}
	
    drawBar(playerId) {
        let bar = document.createElement('div');
        let className = 'bar';
        bar.className = className;
        bar.id = className + playerId;
        this.getTableau(playerId).append(bar);
    }
    
    getBar(playerId) {
        return document.getElementById('bar' + playerId);
    }

	drawTextBar(parent, playerId, text) {
        let textBar = document.createElement('div');
        let className = 'text-bar';
        textBar.className = className;
        textBar.id = className + playerId;
        textBar.innerHTML = text;
        parent.append(textBar);
    }
    
    drawName(playerId, name) {
		let nameField = document.createElement('div');
		let className = 'name-field';
		nameField.className = className;
		nameField.id = className + playerId;
		nameField.innerHTML = name;
		document.getElementById('bar' + playerId).append(nameField);
	}
	
	
    drawHandCards(playerId, parent) {
        for(let i = 0; i < 6; i++) {
            let card= document.createElement('div');
            let className = 'card';
            card.className = className;
            card.id = className + playerId + 'c' + i;
            parent.append(card);
        }
    }
    
	drawHand(playerId) {
        let hand = document.createElement('div');
        let handContainer = document.createElement('div');
        handContainer.className = 'hand-container';
        hand.className = 'hand';
        this.getBar(playerId).append(handContainer);
        this.drawTextBar(handContainer, playerId, 'Hand');
        handContainer.append(hand);
        this.drawHandCards(playerId, hand);
    }
    
    updateHandCard(playerId, cardSpot, card) {
        let c = document.getElementById('card' + playerId + 'c' + cardSpot);
        c.className = 'card card-' + card;
    }
    
    drawCoins(playerId) {
        let coins = document.createElement('div');
		let coin = document.createElement('div');
		coin.className = 'coin';
		coin.id = 'coin' + playerId;
		coin.innerHTML = 0;
        let className = 'coins';
        coins.className = className;
		this.drawTextBar(coins, playerId, 'Geld');		
		this.getBar(playerId).append(coins);

		coins.append(coin);	
    }
    
    updateCoins(playerId, newValue) {
		document.getElementById('coin' + playerId).innerHTML = newValue;
	}
	
	drawActionArea(playerId) {
		let area = document.createElement('div');
        let className = 'action-area';
        area.className = className;
        area.id = className + playerId;
		this.getTableau(playerId).append(area);
	}
	
	getArea(playerId) {
		return document.getElementById('action-area' + playerId);
	}
    
    drawPlayer(playerId, name = '') {
        this.drawTableau(playerId);
        this.drawBar(playerId);
        if(name == '') {
            name = 'Player ' + playerId
        }
		this.drawName(playerId, name);
        this.drawHand(playerId);
		this.drawActionArea(playerId);
		this.drawTresor(playerId);		
		this.drawSchaufenster(playerId);
        this.drawCoins(playerId);
    }
}
