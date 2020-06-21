export default function validarIniciarSesion(valores) {
    let errores = {};

    //Validar email
    if (!valores.email) {
        errores.mail = "El email es obligatorio";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
        errores.email = "Email no válido";
    }

    //validar paassword
    if (!valores.password) {
        errores.password = "El password es oblgiatorio";
    }

    return errores;
}
