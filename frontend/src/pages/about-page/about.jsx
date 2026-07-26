import './about.css'

const About = () => {
    return (
        <div className='about-page'>

            <section className='about-hero'>
                <p className='about-label'>About Opal</p>
                <h1>Fashion made simple, stylish, and effortless.</h1>
                <p>
                    Opal Clothing is an online fashion store designed for women
                    who want modern, affordable, and easy-to-style everyday pieces.
                </p>
            </section>

            <section className='about-content'>
                <div className='about-text'>
                    <h2>Who We Are</h2>
                    <p>
                        We focus on curated collections that make shopping feel
                        simple. From going-out tops to timeless denim and everyday
                        essentials, Opal brings together pieces that can be styled
                        for different occasions.
                    </p>
                    <p>
                        Our goal is to create a clean and enjoyable online shopping
                        experience with clothing that feels confident, modern, and
                        wearable.
                    </p>
                </div>

                <div className='about-card'>
                    <h2>Why Shop With Us?</h2>

                    <div className='about-points'>
                        <div>
                            <h3>Affordable Style</h3>
                            <p>Modern fashion pieces without the high price tag.</p>
                        </div>

                        <div>
                            <h3>Easy Shopping</h3>
                            <p>A simple, responsive browsing experience.</p>
                        </div>

                        <div>
                            <h3>Flexible Returns</h3>
                            <p>Easy exchange and return options for peace of mind.</p>
                        </div>

                        <div>
                            <h3>Customer Support</h3>
                            <p>Helpful support whenever you need assistance.</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default About