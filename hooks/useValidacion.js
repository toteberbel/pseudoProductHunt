//La idead e este custom hook es para utilizarlo tanto en crear cuenta, como en login como en nuevo producto
import React, {
    useState,
    useEffect
} from 'react';

const useValidacion = (stateInicial, validar, fn) => { //Se le pasan tres parametros. 1 el stateinicial, 2 lo que se valida, 3 una funcion

    const [valores, guardarValores] = useState(stateInicial); //Ese stateinicial se lo vamos a mandar dese el componente prnicipal
    const [errores, guardarErrores] = useState({});
    const [submitForm, guardarSubmitForm] = useState(false);

    useEffect(() => {
        if (submitForm) {
            const noErrores = Object.keys(errores).length === 0; //Eso significa bjeto vacío, devuelve true o false
            if (noErrores) {
                fn(); // fn = es la funcion que mandamos a ejectuar desde el componente (xej desde crear-cuenta)
            }
            guardarSubmitForm(false);
        }
    }, [errores]);

    //Funcion que se ejecuta conforme el usuario escribe algo en un input

    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name]: e.target.value,
        });
    }

    //Funcion que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();

        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }

    //Cuando se realice el evento de blur. Blur es cuando se está en un input y clickeas afuera (salis de el)
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur
    };
}

export default useValidacion;