import './login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api.js'

const Login = () => {
    const navigate = useNavigate()

    const [currentState, setCurrentState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage('')
            setIsError(false)
            let response

            if (currentState === 'Sign Up') {
                response = await API.post('/user/register', {
                    name, email, password
                })
            } else {
                response = await API.post('/user/login', {
                    email, password
                })
            }

            if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                setMessage(currentState === 'Sign Up' ? 'Account created successfully!' : 'Logged in successfully!')
                window.dispatchEvent(new Event('auth-change'))

                setTimeout(() => {
                    navigate('/')
                    window.location.reload()
                }, 700)
            } else {
                setIsError(true)
                setMessage(response.data.message || 'Sorry something went wrong, please try again.')
            }
        } catch (error) {
            console.error(error)
            setIsError(true)
            setMessage(error.response?.data?.message || 'Unable to connect to the server.')
        } finally {
            setLoading(false)
        }
    }

    const switchForm = () => {
        setCurrentState((previousState) =>
            previousState === 'Login' ? 'Sign Up' : 'Login'
        )

        setName('')
        setEmail('')
        setPassword('')
        setMessage('')
        setIsError(false)
    }
    
    return (
        <main className='login-page'>
            <form className='login-card' onSubmit={submitHandler}>
                <div className='login-heading'>
                    <p className='login-label'>Welcome to Opal Clothing!</p>
                    <h1>{currentState === 'Login' ? 'Welcome Back' : 'Create Account'}</h1>
                    <p>{currentState === 'Login' ? 'Log in to view your cart and orders.' : 'Join Opal and start building your wardrobe.'}</p>
                </div>

                {currentState === 'Sign Up' && (
                    <div className='login-field'>
                        <label htmlFor='name'>Name</label>
                        <input
                            id='name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your name'
                            required
                        />
                    </div>
                )}

                <div className='login-field'>
                    <label htmlFor='email'>Email</label>
                    <input
                        id='email'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter your email'
                        required
                    />
                </div>

                <div className='login-field'>
                    <label htmlFor='password'>Password</label>
                    <input
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter your password'
                        minLength='6'
                        required
                    />
                </div>

                {message && (
                    <p className={isError ? 'login-message login-error' : 'login-message login-success'}>
                        {message}
                    </p>
                )}

                <button
                    type='submit'
                    className='login-submit-btn'
                    disabled={loading}
                >
                    {loading
                        ? 'Please wait...'
                        : currentState === 'Login'
                            ? 'Log In'
                            : 'Create Account'}
                </button>

                <p className='login-switch'>
                    {currentState === 'Login'
                        ? "Don't have an account?"
                        : 'Already have an account?'}
                    <button type='button' onClick={switchForm}>
                        {currentState === 'Login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </form>
        </main>
    )
}

export default Login