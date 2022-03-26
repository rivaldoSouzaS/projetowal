let tbody = document.querySelector(".corpoTabela");
let tbodyCli = document.querySelector(".corpoTabelaCli");

let idcampanha = 0;

const coletar = async()=>{
    const result = await axios.get(`http://localhost:3000/campanha`);
    carregarTabela(result.data)
}

const coletarClientes = async()=>{
    const result = await axios.get(`http://localhost:3000/cliente`);
    carregarTabelaCliente(result.data)
    //console.log(result)
}

const carregarClientes = async()=>{
    const result = await axios.post(`http://localhost:3000/cliente/${idcampanha}`);
}

const carregarRetorno = async()=>{
  const result = await axios.post(`http://localhost:3000/retorno/${idcampanha}`);
}

const criarCampanha = async()=>{
  const result = await axios.post(`http://localhost:3000/campanha`);
}

coletar();
coletarClientes();

document.getElementById('carregarClientes').addEventListener('click', event =>{
  carregarClientes()
  //console.log(idcampanha);
})

document.getElementById('novaCampanha').addEventListener('click', event =>{
    criarCampanha()
    coletar()
    //coletarClientes()
})

document.getElementById('carregarRetorno').addEventListener('click', event =>{
  carregarRetorno()
})

function carregarTabela(dadosTabela){
    //console.log(dadosTabela)
  let tr = '';
    
  for (let index = 0; index < dadosTabela.length; index++) {
    //console.log(dadosTabela[0].id)
        
    tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
      tr += '<td>' + dadosTabela[index].id + '</td>';
      tr += '<td>' + dadosTabela[index].datacampanha + '</td>';
      tr += '<td>' + dadosTabela[index].eficacia+"%"+ '</td>';
      tr += '<td>' + dadosTabela[index].validade + '</td>';
    tr += '</tr>';
      
  }
  tbody.innerHTML = tr;
}

function selecionar(_id){
  
  desmarcarLinhasTabela()
  var row = document.getElementById(_id);
  row.style.backgroundColor = "rgba(96, 190, 72, 0.39)";
  idcampanha = row.firstChild.textContent;
}

function desmarcarLinhasTabela(){
  for (let index = 0; index < tbody.rows.length; index++) {
    
    tbody.rows[index].style.backgroundColor = "white";
  }
}

function carregarTabelaCliente(dadosTabela){
    //console.log(dadosTabela)
    let trCli = '';
    
    for (let index = 0; index < dadosTabela.length; index++) {
        
        trCli += '<tr onClick="selecionarCli('+index+')" id='+index+'>';
      
        trCli += '<td>' + dadosTabela[index].id + '</td>';
          trCli += '<td>' + dadosTabela[index].idcampanha + '</td>';
          trCli += '<td>' + dadosTabela[index].colaborador + '</td>';
          trCli += '<td>' + dadosTabela[index].idtitulo+ '</td>';
          trCli += '<td>' + dadosTabela[index].nome + '</td>';
          trCli += '<td>' + dadosTabela[index].vencimento + '</td>';
          trCli += '<td>' + dadosTabela[index].pago + '</td>';
        trCli += '</tr>';
        
    }
    tbodyCli.innerHTML = trCli;
}

function selecionarCli(_id){
  console.log("ok")
  desmarcarLinhasTabelaCli()
  var row = document.getElementById(_id);
  row.style.backgroundColor = "rgba(96, 190, 72, 0.39)";
  idcampanha = row.firstChild.textContent;
  console.log("tabela cliente"+ idcampanha)
}

function desmarcarLinhasTabelaCli(){
  for (let index = 0; index < tbodyCli.rows.length; index++) {
    
    tbodyCli.rows[index].style.backgroundColor = "white";
  }
}