let tbody = document.querySelector(".corpoTabela");
let tbodyCli = document.querySelector(".corpoTabelaCli");
let tbodyRetorno = document.querySelector(".corpoTabelaRetorno");

let idcampanha = 0;

const coletar = async()=>{
  const result = await axios.get(`http://localhost:3000/campanha`);
  carregarTabela(result.data)
}

const coletarClientes = async()=>{
  const result = await axios.get(`http://localhost:3000/cliente`);
  carregarTabelaCliente(result.data)
}

const coletarRetorno = async()=>{
  const result = await axios.get(`http://localhost:3000/retorno`);
  console.log(result.data)
  carregarTabelaRetorno(result.data);
}

const coletarClientesPago = async()=>{
  
  if(idcampanha !== 0){
    const result = await axios.get(`http://localhost:3000/cliente/pago/${idcampanha}`);
    carregarTabelaCliente(result.data)
  }
  else{
    alert("selecione uma campanha!")
  }
} 

const carregarClientes = async()=>{
  if(idcampanha !== 0){
    
    const result = await axios.post(`http://localhost:3000/cliente/${idcampanha}`);
    if(result.data !== 0){
      alert('Campanha ja possui clientes')
    }
    else{
      alert('Clientes importados')
    }
    idcampanha = 0;
  }
  else{
    alert("selecione uma campanha!")
  }
  desmarcarLinhasTabela()
}

const carregarClientesPorColab = async()=>{
  const nomeColaborador = document.getElementById('nomeColab').value
  const result = await axios.get(`http://localhost:3000/cliente/${nomeColaborador}/${idcampanha}`);
  carregarTabelaCliente(result.data)
}

const carregarRetorno = async()=>{
  if(idcampanha !== 0){
    const result = await axios.post(`http://localhost:3000/retorno/${idcampanha}`);
    idcampanha = 0;
  }
  else{
    alert("selecione uma campanha!")
  }
}

const criarCampanha = async()=>{
  const acmpanhas = await axios.get(`http://localhost:3000/campanha/valida`);
  if(acmpanhas.data.length >= 1){
    alert("Ja existe uma campanha valida")
  }
  else{
    const result = await axios.post(`http://localhost:3000/campanha`);
  }
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
  //carregarRetorno()
  toggleOverRetorno()
  coletarRetorno()
})

document.getElementById('lerRetorno').addEventListener('click', event =>{
  carregarRetorno()
})

document.getElementById('pagamentoOk').addEventListener('click', event =>{
  coletarClientesPago()
  desmarcarLinhasTabela()
})

document.getElementById('buscar').addEventListener('click', event =>{
  carregarClientesPorColab()
})

document.getElementById('sairRetorno').addEventListener("click", event=>{
  console.log("ok")
  toggleOverRetorno()
})

function carregarTabela(dadosTabela){
    //console.log(dadosTabela)
  let tr = '';
    
  for (let index = 0; index < dadosTabela.length; index++) {
    //console.log(dadosTabela[0].id)
        
    tr += '<tr onClick="selecionar('+index+')" id='+index+'>';
      tr += '<td>' + dadosTabela[index].id + '</td>';
      tr += '<td>' + dadosTabela[index].datacampanha.substring(0, 10); + '</td>';
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
    calcularEficacia(dadosTabela)
    for (let index = 0; index < dadosTabela.length; index++) {
        
        trCli += '<tr" id='+index+'>';
      
        trCli += '<td>' + dadosTabela[index].id + '</td>';
          trCli += '<td>' + dadosTabela[index].idcampanha + '</td>';
          trCli += '<td>' + dadosTabela[index].colaborador + '</td>';
          trCli += '<td>' + dadosTabela[index].idtitulo+ '</td>';
          trCli += '<td>' + dadosTabela[index].nome + '</td>';
          trCli += '<td>' + dadosTabela[index].vencimento.substring(0, 10) + '</td>';
          trCli += '<td>' + dadosTabela[index].pago + '</td>';
        trCli += '</tr>';
        
    }
  tbodyCli.innerHTML = trCli;
}

function carregarTabelaRetorno(dadosTabela){
  let trRet = '';
  for (let index = 0; index < dadosTabela.length; index++) {
      
    trRet += '<tr" id='+index+'>';
      trRet += '<td>' + dadosTabela[index].idretorno + '</td>';
      trRet += '<td>' + dadosTabela[index].campanha + '</td>';
      trRet += '<td>' + dadosTabela[index].titulo + '</td>';
      trRet += '<td>' + dadosTabela[index].nome+ '</td>';
      trRet += '<td>' + dadosTabela[index].dataretorno.substring(0, 10);+ '</td>';
    trRet += '</tr>';
  }
  tbodyRetorno.innerHTML = trRet;
}

function calcularEficacia(dadosTabela){
  //console.log(dadosTabela.length)
  let count = 0;
  let quant = dadosTabela.length;

  for (let index = 0; index < dadosTabela.length; index++) {
    if(dadosTabela[index].pago === true){
      count = count + 1;
    }
    
  }
  let eficacia = (count * 100) / quant
  document.getElementById('total').textContent = quant
  document.getElementById('pago').textContent = count
  document.getElementById('eficacia').textContent = parseInt(eficacia) +"%"
}

function toggleOverRetorno(){
  const overRetorno = document.querySelector(".overRetorno");
  overRetorno.classList.toggle("over_active");
}