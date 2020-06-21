import styled from '@emotion/styled';

const Boton = styled.a`
    display: block;
    font-weight: 700;
    text-transform: uppercase;
    border: 1px solid #d1d1d1;
    padding: .8rem 2rem;
    margin: 2rem auto;
    text-align: center;
    background-color: ${props => props.bgColor ? '#Da552F' : 'white'};
    color: ${props => props.bgColor ? 'white' : '#000'};
    /* Esta es la forma de hacer dinamico un boton, le pasamos props que querramos segun las circustancias en que usemos */

    &:last-of-type{
        margin-right:0;
    }
    &:hover {
        cursor: pointer;
    }
`;

export default Boton;