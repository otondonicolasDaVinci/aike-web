import './styles/About.css'

function About() {
    return (
        <div className="about-wrapper">
            <section className="about-hero">
                <h1>¿Quiénes somos?</h1>
                <p>
                    Aike es un proyecto innovador de alojamiento inteligente en la Patagonia, desarrollado como
                    tesis integradora para la carrera de Analista de Sistemas.
                </p>
            </section>

            <section className="about-details">
                <div className="about-card">
                    <h2>Nuestra Misión</h2>
                    <p>
                        Crear una experiencia única para el huésped combinando naturaleza, tecnología y comodidad.
                        Aike permite reservar, gestionar y acceder a tu cabaña desde tu celular.
                    </p>
                </div>

                <div className="about-card">
                    <h2>El Proyecto</h2>
                    <p>
                        Este sistema fue desarrollado por estudiantes de Da Vinci como parte de un proyecto de tesis,
                        aplicando tecnologías como React, Spring Boot, JWT, Firebase y Mercado Pago.
                    </p>
                </div>

                <div className="about-card">
                    <h2>¿Por qué "Aike"?</h2>
                    <p>
                        Aike es una palabra de origen tehuelche que significa “lugar”. Elegimos este nombre para
                        reflejar la conexión con la tierra patagónica y el concepto de hogar.
                    </p>
                </div>
            </section>
        </div>
    )
}

export default About
