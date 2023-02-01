document.querySelector('#recognize-btn').addEventListener('click',()=>{
    AutomatoPilha(document.querySelector('#input-string').value)
})

let logCount = 0

function addPilha(){
    var $pilha = document.querySelector('#pilha')
    var $pilhaItem = document.createElement('div')
        $pilhaItem.className = 'pilha-item'
        $pilhaItem.innerHTML = '<span>A</span>'
        $pilha.appendChild($pilhaItem)
}

function pularEstado(inicial, destino){
    
    document.getElementById(`q${inicial}`).classList.remove('atual')
    document.getElementById(`q${destino}`).classList.add('atual')
    
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

async function piscarTransicao(inicial, final){
  document.getElementById(`q${inicial}q${final}`).classList.add('transicao-atual')
  console.log('transicao',`q${inicial}q${final}`)
  await sleep(1000)
  document.getElementById(`q${inicial}q${final}`).classList.remove('transicao-atual')
}

function Limpar(){
    document.getElementById('pilha').innerHTML= ''   
    document.getElementById(`q1`).classList.remove('atual')
    document.getElementById(`q2`).classList.remove('atual')
    document.querySelector('#result').innerHTML = ''
    document.querySelector('#log').innerHTML = ''
    document.querySelector('#fita').innerHTML = ''
    logCount = 0
}

async function AutomatoPilha(input) {

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

        await piscarTransicao(0, 1)
        addPilha()
        pularEstado(0, 1)
        addLog(0,1,'A')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Empilhando 'A'.</p>`;
        logCount++;
        
        index++;

      } else if (estado === 1 && char === "a") {
        estado = 1;
        pilha.push("A");

        await piscarTransicao(1, 1)
        addPilha()
        pularEstado(1, 1)
        addLog(1,1,'A')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Empilhando 'A'.</p>`;
        logCount++;
        index++;

      } else if (estado === 1 && char === "b") {
        estado = 2;
        pilha.pop();
        await piscarTransicao(1, 2)
        pularEstado(1, 2)
        addLog(1,2,'B')
        document.querySelector('#log').innerHTML += `<p>${logCount}. Desempilhando A.</p>`;
        logCount++;

        document.getElementsByClassName('pilha-item')[0].remove()

        index++;

      } else if (estado === 2 && char === "b") {
        estado = 2;
        await piscarTransicao(2, 2)
        pularEstado(2, 2)
        addLog(2,2,'B')

        if (pilha.length === 0) {

          document.querySelector('#fita').innerHTML= '<div class="fita-naoaceita-msg">Linguagem não aceita!</div>'
          document.querySelector('#log').innerHTML += `<p class='naoaceita'>${logCount}. Linguagem: ${input} não aceita!`;
          return false;

        } else {

          pilha.pop();
          
          document.querySelector('#log').innerHTML += `<p>${logCount}. Desempilhando A.</p>`;
          document.getElementsByClassName('pilha-item')[0].remove()
          
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
  

  function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }