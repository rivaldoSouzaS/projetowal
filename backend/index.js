const XLSX = require('xlsx')
const express = require('express')
const cors = require('cors')
const app = express();
const pool = require('./db')

app.use(express.json())
app.use(cors())

//------------------------------------------rotas-----------------------------------------------
app.post('/cliente/:id', async (req, res) =>{

    const id = req.params.id
    const quantidade = await quantClientes(id);
    if(quantidade <= 0){
        readExcelClientes(id, 'baseDados.xlsx')
        res.send(quantidade)
    }
    else{
        res.send(quantidade);
    }
})

app.post('/campanha', async (req, res) =>{
    const id = criarCampanha()
    res.send(id);
})

app.post('/retorno/:id', async (req, res) =>{
    //console.log("metodo post")
    const id = req.params.id
    readExcelRetorno(id, 'relatorio.xlsx')
    res.send()
})

app.get('/campanha', async (req, res) =>{
    
    try {
        const result = await retornarCampanhas()
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
})

app.get('/campanha', async (req, res) =>{
    
    try {
        const result = await retornarCampanhas()
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
})

app.get('/campanha/:id', async (req, res) =>{
    console.log(req.params.id);
    res.send();

})

app.get('/cliente', async (req, res) =>{
    
    try {
        const result = await retornarClientes()
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
})

app.get('/cliente/pago/:id', async (req, res) =>{
    
    try {
        const id = req.params.id
        const result = await retornarClientesPago(id)
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
})

app.get('/cliente/:nome/:id', async (req, res) =>{
    
    try {
        const id = req.params.id
        const nome = req.params.nome
        //console.log(id+" "+nome);
        const result = await retornarPorColab(nome, id)
        console.log(result.rowCount+" CODIGO EXPRESS");
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
})

//------------------------------------------rotas-----------------------------------------------
async function retornarCampanhas(){
    const campanhas =  pool.query(
        `SELECT * FROM campanha`
    )
    return campanhas
}

async function retornarClientes(){
    const clientes =  pool.query(
        `SELECT * FROM cliente`
    )
    return clientes
}

async function quantClientes(idCampanha){
    const qtd = await pool.query(
        `select count(*) from cliente c, campanha ca where c.idCampanha = ca.id and ca.id = ${idCampanha};`
    )
    //console.log(qtd.rows[0].count)
    return qtd.rows[0].count;
}

async function retornarClientesPago(idcampanha){
    const result = await marcarPago();
    const clientes =  pool.query(
            `SELECT * FROM cliente WHERE PAGO = true and cliente.idcampanha = ${idcampanha} ORDER BY cliente.colaborador ASC;`
    )
    return clientes
}

async function retornarPorColab(nomeColab, idCampanha){
    //const result = await pool.query(`SELECT * FROM cliente WHERE cliente.colaborador Ilike '%ANTONIO CARLOS PEREIRA SOARES%';`)
    const result = await pool.query(`SELECT * FROM cliente WHERE cliente.colaborador Ilike '%${nomeColab}%';`)
    console.log(result.rowCount+" CODIGO SQL");
    return result
}

async function retornarCampanhasId(id){
    const campanhas =  pool.query(
        `SELECT * FROM campanha WHERE id = ${id}`
    )
    return campanhas
}

async function inserir(id, lista){
    
    const clientes =  pool.query(
        `INSERT INTO cliente (idCampanha, colaborador, idTitulo, nome, vencimento, pago) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id, lista.Colaborador, lista.IDTitulo, lista.Cliente, lista.Vencimento, false]
    )
    
}

async function inserirRetorno(id, lista){
    //console.log(lista.Cliente);
    
    const clientes =  pool.query(
        `INSERT INTO retorno (campanha, titulo, nome) VALUES ($1, $2, $3) RETURNING *`,
        [id, lista.ID, lista.Cliente]
    )
    
}

async function criarCampanha(){
    const data = new Date();
    const eficacia = 0;
    validade = true;
    const id = await pool.query(
        `INSERT INTO campanha(dataCampanha, eficacia, validade) VALUES ($1, $2, $3) RETURNING *`,[data, eficacia, validade]
    )
    return id;
}
/*
async function clientesPago(){
 const result = await pool.query(`select * from cliente c, retorno r where c.idTitulo = r.titulo;`)
 return result;  
}
*/
async function marcarPago(){
    const result = await pool.query(`update cliente set pago = true from retorno where cliente.idtitulo = retorno.titulo`)
}

async function readExcelClientes(id, rout){
    const workbook = XLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    
    for (let index = 0; index < dataExcel.length; index++) {
        
        await inserir(id, dataExcel[index])
    }
    
   //console.log(dataExcel);
}

async function readExcelRetorno(id, rout){
    const workbook = XLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames;

    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

    for (let index = 0; index < dataExcel.length; index++) {
        
        await inserirRetorno(id, dataExcel[index])
    }
}

//------------------------------------------------------------------------------------------------

app.listen('3000', ()=>{
    console.log('server running on port 3000');
})