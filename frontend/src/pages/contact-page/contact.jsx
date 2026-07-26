import './contact.css'

const Contact = () => {
    return (
        <div className='contact-page'>
            <div className='contact-header'>
                <h1>Contact us</h1>
                <p>We'd love to hear from you. Get in touch with the Opal team.</p>
            </div>

            <div className='contact-container'>
                <div className='contact-info'>
                    <h2>Get in Touch</h2>
                    <p>
                        Have a question about an order, returns, or our products?
                        Reach out and we'll get back to you as soon as possible.
                    </p>
                    
                    <div className='contact-details'>
                        <p><strong>Email:</strong> support@opalclothing.com</p>
                        <p><strong>Phone:</strong> +64 123 45678</p>
                        <p><strong>Location:</strong> Auckland, New Zealand</p>
                    </div>
                </div>

                <form className='contact-form'>
                    <input type='text' placeholder='Your Name' required/>
                    <input type='email' placeholder='Your Email' required/>
                    <textarea placeholder='Your Message' rows='6' requiried></textarea>
                    <button type='submit'>Send Message</button>
                </form>
            </div>
        </div>
    )
}

export default Contact