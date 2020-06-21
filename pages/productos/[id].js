import React, { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { FirebaseContext } from "../../firebase";

import Layout from "../../components/layout/Layout";
import Error404 from "../../components/layout/404";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Campo, InputSubmit } from "../../components/ui/Formulario";

import Boton from "../../components/ui/Boton";

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  margin: 0;
`;

const Producto = () => {
  //State del compponente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);

  //Routing para obtener el id actual
  const router = useRouter();

  const {
    query: { id },
  } = router; //Esto seria como extraer query.id de router;

  //Context de firebase (para tener disponibles sus funciones)
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection("productos").doc(id); //De la coleccion productos nos traemos el doc con ese id
        const producto = await productoQuery.get();
        if (producto.exists) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };
      obtenerProducto();
    }
  }, [id, consultarDB]);

  if (Object.keys(producto).length === 0 && !error) return "Cargando...";

  const {
    // id,
    comentarios,
    nombre,
    empresa,
    creado,
    descripcion,
    url,
    votos,
    urlimagen,
    creador,
    haVotado,
  } = producto;

  //Administrar votos

  const votarProducto = () => {
    if (!usuario) {
      return router.push("/login");
    }

    if (haVotado.includes(usuario.uid)) {
      alert("Ya has votado a este producto");
      return;
    }

    //Obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Guardar el id del usuario que ha votado
    const nuevoHavotado = [...haVotado, usuario.uid];

    //Actualizar la db
    firebase.db
      .collection("productos")
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHavotado });

    //Actualizar el state
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
    });
    guardarConsultarDB(true); // Hay un voto por lo tanto consulta a la db;
  };

  //Funciones pa los comentarios
  const comentarioOnChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value,
    });
  };

  //Identificar si el comentario es del creador del producto
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();

    if (!usuario) {
      return router.push("/login");
    }

    if (Object.keys(comentario).length === 0) {
      alert("El comentario no puede estar vacío!");
      return;
    }
    //Info extra del comentario
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    // Tomar copia de comentario y agregarlo al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //Actualizar la db
    firebase.db.collection("productos").doc(id).update({
      comentarios: nuevosComentarios,
    });

    //Actualizar el state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios,
    });

    guardarConsultarDB(true);
  };

  //Funcion que revisa que el creador del producto sea el que esta autenticado
  const puedeBorrar = () => {
    if (!usuario) return false;
    if (creador.id === usuario.uid) return true;
  };

  //Eliminar producto de la db
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push("/login");
    }
    if (creador.id !== usuario.uid) {
      return router.push("/");
    }

    try {
      await firebase.db.collection('productos').doc(id).delete();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <>
        {error ? (
          <Error404 mensaje="Producto Inexistente" />
        ) : (
          <div className="contenedor">
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>
            <ContenedorProducto>
              <div>
                <p>
                  Publicado hace:
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Por: {creador.nombre} de {empresa}
                </p>
                <img src={urlimagen} />
                <p>{descripcion}</p>
                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          onChange={comentarioOnChange}
                          type="text"
                          name="mensaje"
                        />
                      </Campo>
                      <InputSubmit type="submit" value="Agregar Comentario" />
                    </form>
                  </>
                )}
                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios:
                </h2>
                {comentarios.length === 0 ? (
                  "Aun no hay comentarios"
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 1rem;
                          margin-top: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por:
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {" "}
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>ES CREADOR</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Boton target="_blank" bgColor="true" href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    Votos: {votos}
                  </p>
                  {usuario && <Boton onClick={votarProducto}>Votar</Boton>}
                </div>
              </aside>
            </ContenedorProducto>
            {puedeBorrar() && (
              <Boton
                onClick={eliminarProducto}
                css={css`
                  &:hover {
                    background-color: red;
                  }
                `}
              >
                Eliminar Producto
              </Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
