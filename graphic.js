class Graphic {
	
	constructor() {
		this.colors = ['red', 'pink', 'green', 'blue', 'yellow', 'purple', 'white'];
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
    
    drawTresor(playerId) {
        let tresor = document.createElement('div');
        let className = 'tresor';
        tresor.id = className + playerId;
		tresor.className = className;
		tresor.innerHTML = 'tresor';
		this.getArea(playerId).append(tresor);
		let gap = 8;
		for(let i = 0; i < 5; i++) {
			this.drawTresorCard(playerId, i, gap*i, 1.5*gap*i);
		}
    }
	
	drawTresorCard(playerId, cardNum, xPos, yPos) {
		let card = document.createElement('div');
		let className = 'tresor-card';
		card.className = className;
		card.id = className + playerId+cardNum;
		card.style.left = xPos + 'px';
		card.style.bottom = yPos + 'px';
		document.getElementById('tresor' + playerId).append(card);
	}
    
    drawBar(playerId) {
        let bar = document.createElement('div');
        let className = 'bar';
        bar.className = className;
        bar.id = className + playerId;
        this.getTableau(playerId).append(bar);
    }
    
    drawName(playerId, name) {}

    
    getBar(playerId) {
        return document.getElementById('bar' + playerId);
    }
    
    updateTresor(playerId, cards) {
		
	}
    
    drawSchaufenster(playerId) {
        let schaufenster = document.createElement('div');
        let className = 'schaufenster';
        schaufenster.id = className + playerId;
        schaufenster.className = className
		// schaufenster.innerHTML = 'schaufenster';
        this.getArea(playerId).append(schaufenster);
		for(let i = 0; i < this.colors.length; i++) {
			let color = this.colors[i];
			this.drawSchaufensterCard(playerId, color);
		}
    }
	
	drawSchaufensterCard(playerId, color) {
		let card = document.createElement('div');
		let className = 'schaufenster-card card-' + color;
		card.className = className;
		card.id = className + playerId + color;
		card.innerHTML = 0;
		document.getElementById('schaufenster' + playerId).append(card);
	}
    
    updateSchaufenster(playerId) {}

    drawCoins(playerId) {
        let coins = document.createElement('div');
        let className = 'coins';
        coins.className = className;
        coins.id = className + playerId;
		coins.innerHTML = 'coins';		
		this.getArea(playerId).append(coins);
    }
    
    updateCoins(playerId, newValue) {}
	
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
    
    drawPlayer(playerId) {
        this.drawTableau(playerId);
        this.drawBar(playerId);
		this.drawActionArea(playerId);
		this.drawSchaufenster(playerId);
		this.drawTresor(playerId);
        this.drawCoins(playerId);
    }
}
