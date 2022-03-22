create table campanha(
    id serial primary key,
    dataCampanha date,
    eficacia float,
    validade boolean
);

create table cliente(
    id serial primary key,
    idCampanha integer,
    nome varchar(255),
    idTitulo integer,
    vencimento varchar(255),
    pago boolean,
    FOREIGN KEY(idCampanha) REFERENCES campanha(id)
)