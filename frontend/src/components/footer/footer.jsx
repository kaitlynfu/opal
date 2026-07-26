import './footer.css'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets.js'

const Footer = () => {
    return (
        <footer className='footer'>

            <div className='footer-main'>

                <div className='footer-left'>
                    <img
                        src={assets.opal_logo}
                        className='opal-logo'
                        alt='Opal logo'
                    />
                    <p className='footer-desc'>Opal Clothing is an online fashion store offering modern, stylish, and affordable pieces for everyday wear.</p>
                </div>

                <div className='footer-col'>
                    <p className='footer-heading'>Company</p>
                    <div className='footer-links'>
                        <Link to='/'>Home</Link>
                        <Link to='/about'>About Us</Link>
                        <Link to='/contact'>Contact</Link>
                        <Link to='/collection'>Collection</Link>
                        <a href='#'>Privacy Policy</a>
                    </div>
                </div>

                <div className='footer-col'>
                    <p className='footer-heading'>Follow Us</p>
                    <div className='footer-links'>
                        <a href='#'>Instagram</a>
                        <a href='#'>TikTok</a>
                        <a href='#'>Facebook</a>
                        <a href='#'>Pinterest</a>
                    </div>
                </div>

                <div className='footer-newsletter'>
                    <p className='footer-heading'>Join Opal Today!</p>
                    <p className='newsletter-text'>Get updates on new arrivals, sales, and exclusive offers.</p>
                    <div className='footer-input'>
                        <input type='email' placeholder='Email address' />
                        <button>Join</button>
                    </div>
                </div>
            </div>

            <div className='footer-bottom'>
                <p>© 2026 Opal Clothing. All rights reserved.</p>
                <p>Made for modern everyday style.</p>
            </div>
        </footer>
    )
}

export default Footer