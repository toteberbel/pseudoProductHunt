//Este archivo es necesario para poder hacer globales las funciones que nos da firebase
import App from 'next/app';
import firebase, { FirebaseContext } from '../firebase';
import useAutenticacion from '../hooks/useAutenticacion';

const MyApp = (props) => {
    const usuario = useAutenticacion();

    const { Component, pageProps } = props;

    return (
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario,
            }}
        >
            <Component {...pageProps} />
        </FirebaseContext.Provider>
    );
}

export default MyApp;