export default function validarCrearCuenta(valores) {
    let errores = {};

    //Validar nombre
    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio"
    }

    //Validar empresa
    if (!valores.empresa) {
        errores.empresa = "El nombre de la empresa es obligatorio";
    }

    //validar
    if (!valores.descripcion) {
        errores.descripcion = "La descripcion es oblgiatoria";
    }

    if (!valores.url) {
        errores.url = "La url del producto es obligatoria"
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "URL mal formateada o no válida";
    }

    return errores;
}
