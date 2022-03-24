const XLSX = require('xlsx')
const express = require('express')
const cors = require('cors')
const app = express();
const pool = require('./db')

app.use(express.json())
app.use(cors())

async function readExcel(rout){
    const workbook = XLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames;

    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

    const data = new Date();
    const eficacia = 0;
    validade = true;

    
    const id = await pool.query(
        `INSERT INTO campanha(dataCampanha, eficacia, validade) VALUES ($1, $2, $3) RETURNING *`,[data, eficacia, validade]
    )

    //console.log(id.rows[0].id)

    for (let index = 0; index < dataExcel.length; index++) {
        
        await inserir(id.rows[0].id, dataExcel[index])
    }
}

async function inserir(id, lista){
    const clientes =  pool.query(
        `INSERT INTO cliente (idCampanha, idTitulo, nome, vencimento, pago) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, lista.idTitulo, lista.nome, lista.vencimento, lista.pago]
    )

    //console.log(id+ " " + lista.idCampanha);
}

async function retornarCampanhas(){
    const campanhas =  pool.query(
        `SELECT * FROM campanha`
    )
    return campanhas
}

async function retornarCampanhasId(id){
    const campanhas =  pool.query(
        `SELECT * FROM campanha WHERE id = ${id}`
    )
    return campanhas
}

app.post('/campanha', async (req, res) =>{
    console.log("metodo post")
    readExcel('baseDados.xlsx')
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
    //console.log("ok")
    //const result = await retornarCampanhasId(id)
    //res.json(result.rows);
    res.send();

})



app.listen('3000', ()=>{
    console.log('server running on port 3000');
})