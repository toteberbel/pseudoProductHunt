import React, {useState} from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';

const InputText = styled.input`
    border: 1px solid var(--gris3);
    padding: 1rem;
    min-width: 300px;
`;

const InputSubmit = styled.button`
    height: 3rem;
    width: 3rem;
    display: block;
    background-size: 3.5rem;
    background-image: url('/static/img/buscar.png');
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top: 1px;
    background-color: white;
    border: none;
    text-indent: -9999px; /* Esto es necesario para que haya algo dentro de la etiqueta, no puede estar vacía */

    &:hover{
        cursor:pointer;
    }
`;


const Buscar = () => {

    const [busqueda, guardarBusqueda] = useState("");

    const buscarProducto = e => {
        e.preventDefault();

        if (busqueda.trim() === "") return;

        //Redireccionar a /buscar
        //Redireccionamos de esta manera porque no solo necesitamos redireccion sino enviar una query al mismo tiempo
        Router.push({
            pathname: '/buscar',
            query: {
                q: busqueda
            }
        });
    }


    return (
        <form
            css={css`
                position: relative;
            `}
            onSubmit={buscarProducto}
        >
            <InputText type="text"
                placeholder="Buscar productos"
                onChange={e => guardarBusqueda(e.target.value)}
            />
            <InputSubmit type="submit"></InputSubmit>
        </form>
     );
}

export default Buscar;