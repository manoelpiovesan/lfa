document.querySelector('#recognize-btn').addEventListener('click',()=>{
    AutomatoPilha(document.querySelector('#input-string').value)
})

function addPilha(){
    var $pilha = document.querySelector('#pilha')
    var $pilhaItem = document.createElement('div')
        $pilhaItem.className = 'pilha-item'
        $pilhaItem.textContent = 'A'
        $pilha.appendChild($pilhaItem)
}

function pularEstado(inicial, destino){
    document.getElementById(`q${inicial}`).classList.remove('atual')
    document.getElementById(`q${destino}`).classList.add('atual')
}

function Limpar(){
    document.getElementById('pilha').innerHTML= ''
    document.getElementById(`q1`).classList.remove('atual')
    document.getElementById(`q2`).classList.remove('atual')
    document.querySelector('#result').innerHTML = ''
}

async function AutomatoPilha(input) {

    Limpar()
    
 

    let pilha = [];
    let estado = 0;
    let index = 0;
    
    while (index < input.length) {
      let char = input[index];
      if (estado === 0 && char === "a") {
        estado = 1;
        pilha.push("A");

        addPilha()
        pularEstado(0, 1)
        index++;

      } else if (estado === 1 && char === "a") {
        estado = 1;
        pilha.push("A");

        addPilha()
        pularEstado(1, 1)

        index++;

      } else if (estado === 1 && char === "b") {
        estado = 2;
        pilha.pop();

        pularEstado(1, 2)

        document.getElementsByClassName('pilha-item')[0].remove()

        index++;

      } else if (estado === 2 && char === "b") {
        estado = 2;
        pularEstado(2, 2)
        if (pilha.length === 0) {

          document.querySelector('#result').textContent = 'Não aceita!'
          return false;

        } else {

          pilha.pop();
          document.getElementsByClassName('pilha-item')[0].remove()
          
          index++;
        }
      } else {

        document.querySelector('#result').textContent = 'Não aceita!'
        return false;
        
      }
      await sleep(2000);
    }

    document.querySelector('#result').textContent = 'aceita!'
    return pilha.length === 0;
    
  }
  

  function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }