class Graphic {
    
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
        this.getTableau(playerId).append(tresor);
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
    
    updateTresor(playerId, cards) {}
    
    drawSchaufenster(playerId) {
        let schaufenster = document.createElement('div');
        let className = 'schaufenster';
        schaufenster.id = className + playerId;
        this.getTableau(playerId).append(schaufenster);
    }
    
    updateSchaufenster(playerId) {}
    drawCoins(playerId) {
        let coins = document.createElement('div');
        let className = 'coins';
        coins.id = className + playerId;
        this.getBar(playerId).append(coins);  
    }
    
    updateCoins(playerId) {}
    
    drawPlayer(playerId) {
        this.drawTableau(playerId);
        this.drawBar(playerId);
    }
}
