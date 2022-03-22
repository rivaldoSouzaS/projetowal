const XLSX = require('xlsx')
const express = require('express')
const app = express();
const pool = require('./db')

app.use(express.json())

function readExcel(rout){
    const workbook = XLSX.readFile(rout)
    const workbookSheets = workbook.SheetNames;

    //console.log(workbookSheets)

    const sheet = workbookSheets[0]
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])

    console.log(dataExcel[0].id)

    dataExcel.forEach(element => {
        console.log(element.id +' '+element.nome)
    });
}

app.get('/campanha', async (req, res) =>{
    try {
        const result = await pool.query('SELECT * FROM campanha')
        res.json(result)
    } catch (error) {
        console.error(error.message)
    }
    
})

readExcel('baseDados.xlsx')



app.listen('3000', ()=>{
    console.log('server running on port 3000');
})