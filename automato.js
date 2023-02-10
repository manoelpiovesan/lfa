document.querySelector('#recognize-btn').addEventListener('click',()=>{
   if(document.getElementById('automato-select').value == 1){
    AutomatoPilha1(document.querySelector('#input-string').value)
   }else{
    AutomatoPilha2(document.querySelector('#input-string').value)
   }
})

let logCount = 0
// -------- funcoes animacao
function addPilha(char){

  let char1 = char || 'A'

    var $pilha = document.querySelector('#pilha')
    var $pilhaItem = document.createElement('div')
        $pilhaItem.className = 'pilha-item'
        $pilhaItem.innerHTML = `<span>${char1}</span>`
        $pilha.appendChild($pilhaItem)
}

async function removePilha(){

  let item = document.getElementsByClassName('pilha-item')[0]
  item.classList.add('fade-out');
  item.remove();
}

function pularEstado(id,inicial, destino){
    
    document.getElementById(`${id}-q${inicial}`).classList.remove('atual')
    document.getElementById(`${id}-q${destino}`).classList.add('atual')
    
}

function construirFita(input){
  for(var i = 0; i < input.length; i++){
    if(i==0){
      document.querySelector('#fita').innerHTML += `<div class='fita-char lida'>${input[i].toUpperCase()}</div>`
    }else{
      document.querySelector('#fita').innerHTML += `<div class='fita-char'>${input[i].toUpperCase()}</div>`
    }
    
  }
}

function andarFita(index){
  document.getElementsByClassName('fita-char')[index].classList.add('lida')
  document.getElementsByClassName('fita-char')[index-1].classList.remove('lida')
}

function addLog(inicial, final, lido){
  if(inicial != final){
    document.querySelector('#log').innerHTML += `<p>${logCount}. Lendo: ${lido} | Mudança de estado: q${inicial}  → q${final}.</p>`;
  }else{
    document.querySelector('#log').innerHTML += `<p>${logCount}. Lendo: ${lido} | Sem mudança, permanecendo em q${inicial}.</p>`;
  }
  logCount++;
}

async function piscarTransicao(id, inicial, final){
  if(inicial == final){
    document.getElementById(`${id}-q${inicial}q${final}`).src = '/return02.png'
    await sleep(1000)
    document.getElementById(`${id}-q${inicial}q${final}`).src = '/return01.png'
  }else{
    document.getElementById(`${id}-q${inicial}q${final}`).src = '/next02.png'
    await sleep(1000)
    document.getElementById(`${id}-q${inicial}q${final}`).src = '/next01.png'
  }
}


document.querySelector('#automato-select').addEventListener('change',()=>{
  mudarAutomato()
})
//-----------------------------------------------
function mudarAutomato(){
  let automato =  document.getElementById('automato-select').value
  let displays = document.getElementsByClassName('automato-display')
  let counter = 0
  while(counter < displays.length){
    document.getElementsByClassName('automato-display')[counter].classList.add('invisible')
    counter++
  }

  document.getElementById(`automato-${automato}-display`).classList.remove('invisible')
  
}

function Limpar(){
    document.getElementById('pilha').innerHTML= ''   
    document.querySelector('#result').innerHTML = ''
    document.querySelector('#log').innerHTML = ''
    document.querySelector('#fita').innerHTML = ''
    logCount = 0

    // var estados = document.getElementsByClassName('estado')
    // estados.forEach(element => {
    //   element.classList.remove('atual')
    // })
}

async function AutomatoPilha1(input) {

    Limpar()

    let pilha = [];
    let estado = 0;
    let index = 0;
    
    construirFita(input)

    while (index < input.length) {
      let char = input[index].toLowerCase();
      
      if(index != 0){
        andarFita(index)
      }

      if (estado === 0 && char === "a") {
        estado = 1;
        pilha.push("A");

        await piscarTransicao(1,0, 1)
        addPilha()
        pularEstado(1, 0, 1)
        addLog(0,1,'A')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Empilhando 'A'.</p>`;
        logCount++;
        
        index++;

      } else if (estado === 1 && char === "a") {
        estado = 1;
        pilha.push("A");

        await piscarTransicao(1,1, 1)
        addPilha()
        pularEstado(1, 1, 1)
        addLog(1,1,'A')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Empilhando 'A'.</p>`;
        logCount++;
        index++;

      } else if (estado === 1 && char === "b") {
        estado = 2;
        pilha.pop();
        await piscarTransicao(1, 1, 2)
        pularEstado(1,1, 2)
        addLog(1,2,'B')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Desempilhando A.</p>`;
        logCount++;

        await removePilha()

        index++;

      } else if (estado === 2 && char === "b") {
        estado = 2;
        await piscarTransicao(1,2, 2)
        pularEstado(1, 2, 2)
        addLog(2,2,'B')

        if (pilha.length === 0) {

          document.querySelector('#fita').innerHTML= '<div class="fita-naoaceita-msg">Linguagem não aceita!</div>'
          document.querySelector('#log').innerHTML += `<p class='naoaceita'>${logCount}. Linguagem: ${input} não aceita!`;
          return false;

        } else {

          pilha.pop();
          
          document.querySelector('#log').innerHTML += `<p>${logCount}. Desempilhando A.</p>`;
          await removePilha()
          
          logCount++;
          index++;
        }
      } else {
        
        document.querySelector('#fita').innerHTML= '<div class="fita-naoaceita-msg">Linguagem não aceita!</div>'
        document.querySelector('#log').innerHTML += `<p class='naoaceita'>${logCount}. Linguagem: ${input} não aceita!`;
        logCount++;
        return false;
        
      }
      await sleep(2000);
    }
    
    document.querySelector('#fita').innerHTML= '<span class="fita-aceita-msg">Linguagem aceita!</span>'
    document.querySelector('#log').innerHTML += `<p class='aceita'>${logCount}. Linguagem: ${input} aceita!`;
    logCount++;
    return pilha.length === 0;
    
  }
async function AutomatoPilha2(input){
  Limpar()

    let pilha = [];
    let estado = 0;
    let index = 0;
    
    construirFita(input)

    while (index < input.length){
      let char = input[index].toLowerCase()
      if(index!=0){andarFita(index)}

      if(char == 'a' && estado == 0){
        pilha.push('A')
        await sleep(500)
        pilha.push('A')
        
        await piscarTransicao(2,0, 0)
        addPilha()
        addPilha()
        pularEstado(2, 0, 0)
        addLog(0,0,'A')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Empilhando dois 'A's.</p>`;
        logCount++;

       
        estado=0

      }
      else if(char == 'b' && estado == 0){
        
        await piscarTransicao(2,0, 1)
        pularEstado(2, 0, 1)
        addLog(0,1,'B')
        
        estado = 1
        

      }
      else if(char == 'a' && estado == 1){
        pilha.pop()
        removePilha()

        document.querySelector('#log').innerHTML += `<p>${logCount}. Desempilhando um 'A'.</p>`;
        logCount++
        
        await piscarTransicao(2,1,1)
        pularEstado(2, 1, 1)
        addLog(1,1,'A')

        
        estado=1
      }
      else if(char=='b' && estado == 1){
        console.log('aq')
        document.querySelector('#fita').innerHTML= '<div class="fita-naoaceita-msg">Linguagem não aceita!</div>'
        document.querySelector('#log').innerHTML += `<p class='naoaceita'>${logCount}. Linguagem: ${input} não aceita!`;
        logCount++;
        return false
      }
      else if(char == 'a' && index == input.length-1 && estado == 1 && pilha.length !=0){
        pilha.pop()
        removePilha()
        document.querySelector('#log').innerHTML += `<p>${logCount}. Desempilhando um 'A'.</p>`;
        logCount++
        
        await piscarTransicao(2,1,2)
        pularEstado(2, 1, 2)
        addLog(1,2,'A')

        
        estado=2
        console.log('fim ae')
        document.querySelector('#fita').innerHTML= '<span class="fita-aceita-msg">Linguagem aceita!</span>'
        document.querySelector('#log').innerHTML += `<p class='aceita'>${logCount}. Linguagem: ${input} aceita!`;        
        console.log('aceita')
        break
      }
      else if(char == 'a' && estado == 1 && pilha.length == 0 && index == input.length-1){
        console.log('nao aceita')
        return false
      }
      
      index++
      await sleep(3000)

    }

    if(pilha.length!=0){
      document.querySelector('#fita').innerHTML= '<div class="fita-naoaceita-msg">Linguagem não aceita!</div>'
      document.querySelector('#log').innerHTML += `<p class='naoaceita'>${logCount}. Linguagem: ${input} não aceita!`;
      console.log('falso: fim com pilha negativa')
      return false
    }else if(pilha.length == 0 && estado == 2){
      document.querySelector('#fita').innerHTML= '<div class="fita-aceita-msg">Linguagem aceita!</div>'
      document.querySelector('#log').innerHTML += `<p class='aceita'>${logCount}. Linguagem: ${input} aceita!`;
      console.log('vdd: fim com pilha vazia')
      return true
    }
}


  function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }