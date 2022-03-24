const coletarCampanha = async()=>{
    const result = await axios.get(`${url}?sort_by=DESCRICAO&sort_order=asc`);
    console.log(result.data)
    return result.data;
    
}