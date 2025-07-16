import './styles/Contact.css'
import type { FormEvent } from 'react'

function Contact() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const message = formData.get('message') as string

        const mailto = `mailto:otondonicolas@gmail.com?subject=${encodeURIComponent(
            `Consulta de ${name}`
        )}&body=${encodeURIComponent(`${message}\n\nDe: ${name} <${email}>`)}`
        window.location.href = mailto
        form.reset()
    }

    return (
        <div className="contact-page">
            <h1>Contacto</h1>
            <p>Estamos disponibles para resolver tus dudas o ayudarte con tu reserva.</p>
            <div className="contact-info">
                <p>Email: contacto@aike.com</p>
                <p>Teléfono: +54 9 11 1234 5678</p>
                <p>Ubicación: Patagonia Argentina</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                    Nombre
                    <input type="text" name="name" required />
                </label>
                <label>
                    Email
                    <input type="email" name="email" required />
                </label>
                <label>
                    Consulta
                    <textarea name="message" rows={5} required />
                </label>
                <button type="submit">Enviar consulta</button>
            </form>
        </div>
    )
}

export default Contact;
