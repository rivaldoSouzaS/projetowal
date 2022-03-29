create table campanha(
    id serial primary key,
    dataCampanha date,
    eficacia float,
    validade boolean
);

create table cliente(
    id serial primary key,
    idCampanha integer,
    colaborador varchar(255),
    idTitulo integer not null,
    nome varchar(255),
    vencimento varchar(255),
    pago boolean,
    FOREIGN KEY(idCampanha) REFERENCES campanha(id)
);

create table retorno(
    idRetorno serial primary key,
    campanha integer not null,
    titulo integer not null,
    nome varchar(255),
    FOREIGN KEY(campanha) REFERENCES campanha(id)
);

select * from cliente c, retorno r where c.idTitulo = r.titulo;

update cliente set pago = true where id = 1;

select ca.dataCampanha, ca.id, c.colaborador, c.nome 
from cliente c, retorno r, campanha ca
where c.idtitulo = r.titulo and ca.id = 1;

select ca.dataCampanha, ca.id, c.colaborador, c.nome 
from cliente c, retorno r, campanha ca
where c.idtitulo = r.titulo and c.colaborador LIKE 'MAYARA NUNES DA SILVA SANTOS' and ca.id = 1;

SELECT * FROM cliente WHERE cliente.colaborador Ilike 'MAYARA NUNES DA SILVA SANTOS';


select c.idtitulo, r.titulo from cliente c, retorno r
where c.idtitulo = r.titulo;

select count(*) from retorno;

drop table retorno;
drop table cliente;
drop table campanha;