create table campanha(
    id serial primary key,
    dataCampanha date,
    eficacia float,
    validade boolean
);

create table cliente(
    id serial primary key,
    idCampanha integer,
    idTitulo integer,
    nome varchar(255),
    vencimento varchar(255),
    pago boolean,
    FOREIGN KEY(idCampanha) REFERENCES campanha(id)
);

drop table cliente;
drop table campanha;
