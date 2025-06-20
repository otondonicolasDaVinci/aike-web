import './styles/AppPage.css'

function AppPage() {
    return (
        <div className="app-page">
            <h1>Aplicación Móvil</h1>
            <p>
                Nuestra app está diseñada para complementar tu estadía en nuestras cabañas. Desde allí
                podrás acceder a tu cabaña, hablar con la IA para recibir recomendaciones personalizadas,
                y gestionar tus reservas.
            </p>
            <p>
                Disponible próximamente para Android. Recibirás una notificación apenas esté lista para
                descargar.
            </p>
            <button disabled className="app-coming-soon">
                Próximamente
            </button>
        </div>
    );
}

export default AppPage;
