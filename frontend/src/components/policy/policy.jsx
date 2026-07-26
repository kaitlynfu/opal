import './policy.css'
import { assets } from "../../assets/assets.js"

const Policy = () => {
    return (
        <section className='policy-section'>
            <div className='policy-header'>
                <p>Why Shop With Us</p>
                <h2>Opal Clothing</h2>
            </div>
            <div className='policy-container'>
                <div className='policy-card'>
                    <div className='policy-icon-box'>
                        <img src={assets.quality_icon} className='policy-icon' alt='Return Policy'/>
                    </div>
                    <p className='policy-title'>30 Day Returns</p>
                    <p className='policy-desc'>Easy returns within 30 days for peace of mind.</p>
                </div>
                <div className='policy-card'>
                    <div className='policy-icon-box'>
                        <img src={assets.exchange_icon} className='policy-icon' alt='Exchange Policy'/>
                    </div>
                    <p className='policy-title'>Easy Exchange</p>
                    <p className='policy-desc'>Quick and simple exchanges if your item is not quite right.</p>
                </div>
                <div className='policy-card'>
                    <div className='policy-icon-box'>
                        <img src={assets.system_icon} className='policy-icon' alt='Customer Support'/>
                    </div>
                    <p className='policy-title'>Customer Support</p>
                    <p className='policy-desc'>Our friendly support team is here whenever you need help.</p>
                </div>
            </div>
        </section>
    )
}

export default Policy