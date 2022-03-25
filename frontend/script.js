var tbody = document.querySelector(".corpoTabela");
var tbodyCli = document.querySelector(".corpoTabelaCli");


const coletar = async()=>{
    const result = await axios.get(`http://localhost:3000/campanha`);
    carregarTabela(result.data)
}

const coletarClientes = async()=>{
    const result = await axios.get(`http://localhost:3000/cliente`);
    carregarTabelaCliente(result.data)
}

const criarCampanha = async()=>{
    const result = await axios.post(`http://localhost:3000/campanha`);
}

document.getElementById('carregarCampanha').addEventListener('click', event =>{
    coletar()
    coletarClientes()
})

document.getElementById('novaCampanha').addEventListener('click', event =>{
    criarCampanha()
    coletar()
    //coletarClientes()
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

function carregarTabelaCliente(dadosTabela){
    console.log(dadosTabela)
    var tr = '';
    
    for (let index = 0; index < dadosTabela.length; index++) {
        console.log(dadosTabela[0].id)
        
      tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
      
        tr += '<td>' + dadosTabela[index].id + '</td>';
        tr += '<td>' + dadosTabela[index].idcampanha + '</td>';
        tr += '<td>' + dadosTabela[index].idtitulo+"%"+ '</td>';
        tr += '<td>' + dadosTabela[index].nome + '</td>';
        tr += '<td>' + dadosTabela[index].vencimento + '</td>';
        tr += '<td>' + dadosTabela[index].pago + '</td>';
        
      tr += '</tr>';
      
    }
    
    tbodyCli.innerHTML = tr;
}