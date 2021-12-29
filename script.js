
const playerFactory = (name, mark) => {
    return {name, mark}
}


// radio logic

let radios1 = document.querySelectorAll(`input[type=radio][name="markPlayer1"]`)
radios1.forEach(radio => {
    radio.addEventListener("change", () => {
        
        if (document.querySelector('input[name="markPlayer2"]:checked').value === "O") {
            
            document.getElementById("player2X").checked = true
            document.getElementById("player2O").checked = false
            Game.startGame()
        } else if (document.querySelector('input[name="markPlayer1"]:checked').value === "X")
        {
            document.getElementById("player2X").checked = false
            document.getElementById("player2O").checked = true
            Game.startGame()
        }
    })
})

let radios2 = document.querySelectorAll(`input[type=radio][name="markPlayer2"]`)
radios2.forEach(radio => {
    radio.addEventListener("change", () => {

        if (document.querySelector('input[name="markPlayer2"]:checked').value === "X") {
            
            document.getElementById("player1X").checked = false
            document.getElementById("player1O").checked = true
            Game.startGame()

        }

        else if (document.querySelector('input[name="markPlayer2"]:checked').value === "O")
        {
            document.getElementById("player1X").checked = true
            document.getElementById("player1O").checked = false
            Game.startGame()
            
        }
    })
})

// end radio logic

// reset button
resetButton = document.getElementById("gameReset")
resetButton.addEventListener("click", ()=>{

    document.getElementById("playerInfo1").reset()
    document.getElementById("playerInfo2").reset()

    if(Ai.aiMode){
        Game.startGame()
        Ai.bestMove()
        Game.roundCounter = 1
        Gameboard.renderBoard()
        return
    } else {
    document.getElementById("playerInfo1").reset()
    document.getElementById("playerInfo2").reset()
    Game.startGame()
    }
    
})

// event listener for game
// adding "X" or "O" to corresponding field 

const fields = document.querySelectorAll(".field")

fields.forEach(square => {
    square.addEventListener("click", function _squaresEventlistener() {
        
        if (!Game.winner) {

        if (Game.roundCounter === 0){
            Game.startGame()
        }
        Gameboard.setValue(Game.currentSign(), square.dataset.square)
        
        Gameboard.renderBoard()
        Game.getWinner()
        

        
        } 
    }
    )
});

// setArray, renderBoard, setValue

const Gameboard = (() => {
    const setArray = () => {
        Game.gameboardArray = ["","","","","","","","","",]
    }

    const renderBoard = () => {
        fields.forEach(square => {
            square.innerHTML = ""
        })
        Game.gameboardArray.forEach((item, index) => {
        document.querySelector(`[data-square="${index}"]`).innerHTML += `<p>${item}</p>`;
        });

    }
 
    const setValue = (value, square) => {

        if (Game.gameboardArray[square] === "X" || Game.gameboardArray[square] === "O") {
            Game.roundCounter--
            console.log("counter stays at "+ Game.roundCounter)
            return
        }

        // if Ai mode is not active
        if(!Ai.aiMode){
        Game.gameboardArray[square] = value;
        Game.roundCounter++
        // when Ai mode is active
        } else {
            console.log("Ai mode active")
            Game.gameboardArray[square] = value;
            Game.roundCounter++
            Ai.bestMove()
            Game.roundCounter++
            Gameboard.renderBoard()

        }
    }
    
    return {renderBoard, setValue, setArray}
})()

// start Game module pattern
// roundCounter, currentSign, gameboardArray, startGame, getWinner, winner, isMovesLeft
const Game = (() => {
    
    let gameboardArray = ["","","","","","","","","",]
    let roundCounter = 0;
    let winner = false

    const currentSign = () => {
        

        if (Game.roundCounter % 2 == 0)  {
            // Even Number
            return player1.mark
        } else {
            return player2.mark
        }
    } 
    
    
   const startGame = () => {


    // resetting all the parameters and variables
    fields.forEach(square => {
        square.innerHTML = ""
    })

    Game.roundCounter = 0
    document.getElementById("stats").innerHTML = ""
    Game.winner = false
    Gameboard.setArray()

    if (document.getElementById("player1Name").value === ""){
        player1 = playerFactory("Player 1", document.querySelector('input[name="markPlayer1"]:checked').value)
        
    } else {
        player1 = playerFactory(document.getElementById("player1Name").value, document.querySelector('input[name="markPlayer1"]:checked').value)
    }
    
    if (document.getElementById("player2Name").value === ""){
        player2 = playerFactory("Player 2", document.querySelector('input[name="markPlayer2"]:checked').value)
    } else {
        player2 = playerFactory(document.getElementById("player2Name").value, document.querySelector('input[name="markPlayer2"]:checked').value)
        
    }
    if (Ai.aiMode){
        player1 = playerFactory("AI Bot", "X")
        player2 = playerFactory("You", "O")
    }
    return player1, player2
    
   }

   // determine winner logic
   // if one mark is on all the fields in one of these arrays it's a winner
    const winningFormulars = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
    ]
    
    const getWinner = () => {

        let itemBeingChecked = player1.mark
        let value = null

    for (let i = 0; i < 2; i++) {
        
        winningFormulars.forEach(item => {

            
            if ((Game.gameboardArray[item[0]] === itemBeingChecked) &&
                (Game.gameboardArray[item[1]] === itemBeingChecked) && 
                (Game.gameboardArray[item[2]] === itemBeingChecked)) {
                   
                    Game.winner = true

                if (itemBeingChecked === player1.mark){
                    document.getElementById("stats").innerHTML = player1.name + " won this game"
                    value = 10
                    return
    
                } else if (itemBeingChecked === player2.mark) {
                    document.getElementById("stats").innerHTML = player2.name + " won this game"
                    value = -10
                    return
                }
            }  
        })  
    
        itemBeingChecked = player2.mark


        if (Game.roundCounter === 9 && Game.winner === false) {
            document.getElementById("stats").innerHTML = "This game is a draw"
            Game.roundCounter = 0;
            Game.winner = true
            value = 0
        }}

        return value
    }

    // returns true if possible moves are left / false when not 
    const isMovesLeft = () => {
        let movesLeft = false
        Game.gameboardArray.forEach(item => {
            if (item === "") {
             movesLeft = true
    
            } else {
            movesLeft = false
        }})
        return movesLeft
    }
  
    return {roundCounter, currentSign, gameboardArray, startGame, getWinner, winner, isMovesLeft}
})()
// end Game module pattern



const aiToggle = document.getElementById("ai")
const gameInputWrapper = document.getElementById("gameInputWrapper")
aiToggle.addEventListener("click", ()=> {
    (Ai.aiMode === true ? Ai.aiMode = false : Ai.aiMode = true);

    
    if (Ai.aiMode) {
    Ai.startAiGame()
    aiToggle.textContent = "Play against person"
    document.getElementById("gameInputWrapper").style.visibility = 'hidden'
    } else {
        aiToggle.textContent = "Play against AI"
        document.getElementById("gameInputWrapper").style.visibility = "visible"
        document.getElementById("playerInfo1").reset()
        document.getElementById("playerInfo2").reset()
        Game.startGame()

    }
})

const Ai = (() => {

    let aiMode = false

    const startAiGame = () => {
        Game.startGame()
        Ai.bestMove()
        Game.roundCounter++

    Gameboard.renderBoard()
    }


    const winningFormulars = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
        ]

    const _getValue = () => {

        let itemBeingChecked = player1.mark
        let value = 0

    for (let i = 0; i < 2; i++) {
        
        winningFormulars.forEach(item => {

            
            if ((Game.gameboardArray[item[0]] === itemBeingChecked) &&
                (Game.gameboardArray[item[1]] === itemBeingChecked) && 
                (Game.gameboardArray[item[2]] === itemBeingChecked)) {
    

                if (itemBeingChecked === player1.mark){
                    value = 10
                    return
    
                } else if (itemBeingChecked === player2.mark) {
                    value = -10
                    return
                }
            }  
        })  
    
        itemBeingChecked = player2.mark


        if (Game.roundCounter === 9 && Game.winner === false) {
            value = 0
        }}

        return value
    }

    const bestMove = () => {
        
          // AI to make its turn
        let bestScore = -Infinity;
        let move;
    for (let i = 0; i < 10 ; i++) {

      // Is the spot available?
      if (Game.gameboardArray[i] == '') {
        Game.gameboardArray[i] = player1.mark
        let score = minimax(Game.gameboardArray, 0, false);
        Game.gameboardArray[i] = ""

        if (score > bestScore) {
          bestScore = score;
          move = i
        }
      }
    
  }
  Game.gameboardArray[move] = player1.mark
  return
    }



    function minimax(board, depth, isMaximizing) {
        let score = _getValue()
        if (score !== 0) {
          return score
        }
        if (Game.isMovesLeft() == false){
            return 0;
        }
      
        if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < Game.gameboardArray.length; i++) {
              // Is the spot available?
              if (Game.gameboardArray[i] == '') {
                Game.gameboardArray[i] = player1.mark
                let score = minimax(board, depth + 1, false);
                Game.gameboardArray[i] = '';
                bestScore = Math.max(score, bestScore);
              }
          }
          return bestScore;
        } else {
          let bestScore = Infinity;
          for (let i = 0; i < Game.gameboardArray.length; i++) {

              // Is the spot available?
              if (Game.gameboardArray[i] == '') {
                Game.gameboardArray[i] = player2.mark;
                let score = minimax(board, depth + 1, true);
                Game.gameboardArray[i] = '';
                bestScore = Math.min(score, bestScore);
              }
          }
          return bestScore;
        }
      }


return {aiMode, bestMove, startAiGame}
})()