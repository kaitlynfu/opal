import './newsletter-box.css'

const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault()
        alert('Thank you for subscribing!')
    }

    return (
        <div className='newsletter-box'>
            <div className='subscription-wrapper'>
                <p className='newsletter-box-subscription'>Subscribe Now & Get 20% Off!</p>
                <p className='newsletter-box-subscription-desc'>Limited-time offer! Subscribe today and save on your first order.</p>
                <form onSubmit={onSubmitHandler} className='subscription-container'>
                    <input className='subscription-input' type='email' placeholder='Enter your email adress...' required/>
                    <button type='submit' className='subscription-btn'>Subscribe</button>
                </form>
            </div>
        </div>
    )
}

export default NewsletterBox