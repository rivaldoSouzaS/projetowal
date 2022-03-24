var tbody = document.querySelector(".corpoTabela");


const coletar = async()=>{
    const result = await axios.get(`http://localhost:3000/campanha`);
    carregarTabela(result.data)
}

const criarCampanha = async()=>{
    const result = await axios.post(`http://localhost:3000/campanha`);
}

document.getElementById('carregarCampanha').addEventListener('click', event =>{
    coletar()
})

document.getElementById('novaCampanha').addEventListener('click', event =>{
    criarCampanha()
    coletar()
})

function carregarTabela(dadosTabela){
    console.log(dadosTabela)
    var tr = '';
    
    for (let index = 0; index < dadosTabela.length; index++) {
        console.log(dadosTabela[0].id)
        
      tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
        tr += '<td>' + dadosTabela[index].id + '</td>';
        tr += '<td>' + dadosTabela[index].datacampanha + '</td>';
        tr += '<td>' + dadosTabela[index].eficacia+"%"+ '</td>';
        tr += '<td>' + dadosTabela[index].validade + '</td>';
      tr += '</tr>';
      
    }
    
    tbody.innerHTML = tr;
  }