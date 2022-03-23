const XLSX = require('xlsx')
const express = require('express')
const app = express();
const pool = require('./db')

app.use(express.json())

async function readExcel(rout){
    const workbook = XLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames;

    //console.log(workbookSheets)

    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

    //console.log(dataExcel[0].id)

    const data = new Date();
    const eficacia = 0;
    validade = true;
    
    /*
    const novaCampanha = await pool.query(
        `INSERT INTO cliente(dataCampanha, eficacia, validade) VALUES ($1, $2, $3) RETURNING *`,[data, eficacia, validade]
    )
    
    const clientes = await pool.query(
        `INSERT INTO campanha(idCampanha, idTitulo, nome, vencimento, pago) VALUES ($1, $2, $3, $4, $5) RETURNING *`,[data, eficacia, validade]
    )
    */
    
    
    dataExcel.forEach(element => {
        console.log(element.idCampanha +' '+element.idTitulo, element.nome, element.vencimento, element.pago)
    });
    
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function  formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
}

app.post('/campanha', async (req, res) =>{
    try {
        
        const data = new Date();
        const {eficacia} = req.body
        const {validade} = req.body

        const novaCampanha = await pool.query(
            `INSERT INTO campanha(dataCampanha, eficacia, validade) VALUES ($1, $2, $3) RETURNING *`,[data, eficacia, validade]
        )
        res.json(novaCampanha.rows[0].id)
        //res.send(novaCampanha.rows.id)
    } catch (error) {
        console.log(error);
    }
})

readExcel('baseDados.xlsx')

app.listen('3000', ()=>{
    console.log('server running on port 3000');
})