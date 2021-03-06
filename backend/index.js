const XLSX = require('xlsx')
const express = require('express')
const cors = require('cors')
const app = express();
const pool = require('./db')
//importar arquivo com muter
const multer = require("multer")
const path = require('path')

app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/clientes')
    },
    filename: function(req, file, cb){
        cb(null, 'clientes'+ path.extname(file.originalname))
    }
})

const storageRetorno = multer.diskStorage({
    destination: function(req, file, cbr){
        cbr(null, 'uploads/retorno')
    },
    filename: function(req, filer, cbr){
        cbr(null, 'retorno'+ path.extname(filer.originalname))
    }
})

/**depois que se cria a constante multer esse objeto que se passar como parametro 
 * tem como chave a palavra storage e como valor a constante criada que recebe o 
 * resultado do multer.diskStorage, presta atenção a isso.
 */

const uploadCliente = multer({storage})
const updateRetorno = multer({storage:storageRetorno})

//------------------------------------------rotas-----------------------------------------------
app.post('/upload/clientes',uploadCliente.single("file"), (req, res) =>{
    res.send("Arquivo recebido com sucesso!")
})

app.post('/upload/retorno',updateRetorno.single("fileRetorno"), (req, res) =>{
    res.send("Arquivo retorno com sucesso!")
})

app.post('/cliente/:id', async (req, res) =>{

    const id = req.params.id
    const quantidade = await quantClientes(id);
    if(quantidade <= 0){
        
        await readExcelClientes(id, 'uploads/clientes/clientes.xlsx')
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

app.put('/campanha/:id', async (req, res) =>{
    const id = req.params.id
    const result = await retornarClientes();
    const listaClientes = result.rows;
    let cont = 0;
    for (let index = 0; index < listaClientes.length; index++) {
        if(listaClientes[index].pago === true){
            cont = cont + 1;
        }
    }
    let quantClientes = listaClientes.length
    let quantPago = cont
    let eficacia = (cont*100) /quantClientes;
    eficacia = eficacia.toFixed(2)
    //console.log(eficacia)

    try {
        await encerrarCampanha(id, eficacia);
    } catch (error) {
        console.log(error)
    }
})

app.post('/retorno/:id', async (req, res) =>{
    //console.log("metodo post")
    const id = req.params.id
    await readExcelRetorno(id,'uploads/retorno/retorno.xlsx')
        res.status(204).send()

    try {
        
    } catch (error) {
        res.status(500).send()
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

app.get('/retorno', async (req, res) =>{
    
    try {
        const result = await retornarRetorno()
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

app.get('/campanha/valida', async (req, res) =>{
    
    try {
        const result = await retornarCampanhasValidas()
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
})

app.get('/campanha/:id', async (req, res) =>{
    const campId = req.params.id
    try {
        const result = await campanhaPorId(campId)
        res.json(result.rows);
    } catch (error) {
        console.log(error)
    }
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
        res.status(500).send(error)
    }
})

app.get('/cliente/:nome/:id', async (req, res) =>{
    
    try {
        const id = req.params.id
        const nome = req.params.nome
        const result = await retornarPorColab(nome, id)
        //console.log(result.rowCount+" CODIGO EXPRESS");
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

async function retornarCampanhasValidas(){
    const campanhas =  pool.query(
        `SELECT * FROM campanha where validade = true`
    )
    return campanhas
}

async function campanhaPorId(id){
    const campanhas =  pool.query(
        `SELECT * FROM campanha where id = ${id}`
    )
    return campanhas
}

async function retornarClientes(){
    const clientes =  pool.query(
        `SELECT * FROM cliente`
    )
    return clientes
}

async function retornarRetorno(){
    const retorno =  await pool.query(
        `SELECT * FROM retorno`
    )
    return retorno
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
    //console.log(result.rowCount+" CODIGO SQL");
    return result
}

async function retornarCampanhasId(id){
    const campanhas =  pool.query(
        `SELECT * FROM campanha WHERE id = ${id}`
    )
    return campanhas
}

async function inserir(id, lista){
    const clientes =  await pool.query(
        `INSERT INTO cliente (idCampanha, colaborador, idTitulo, nome, vencimento, pago) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id, lista.Colaborador, lista.IDTitulo, lista.Cliente, lista.Vencimento, false]
    )
}

async function inserirRetorno(id, lista){
    //console.log(lista.Cliente);
    const data = new Date();
    const result =  await pool.query(
        `INSERT INTO retorno (campanha, titulo, nome, dataretorno) VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, lista.ID, lista.Cliente, data]
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

async function encerrarCampanha(idCampanha, eficaciaCampanha){
    const result = await pool.query(`update campanha set eficacia = ${eficaciaCampanha}, validade = false where id = ${idCampanha}`)
}

async function readExcelClientes(id, rout){
    const workbook = XLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    
    for (let index = 0; index < dataExcel.length; index++) {
        //console.log(dataExcel[index].Vencimento.toString().replace(' ','/'))
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