import './profile.css'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../context/shop-context.jsx'
import { ToastContext } from '../../context/toast-context.jsx'

const Profile = () => {
    const navigate = useNavigate()
    const shopContext = useContext(ShopContext)
    const toastContext = useContext(ToastContext)

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const storedUser = useMemo(() => {
        try {
            const savedUser = localStorage.getItem('user')
            return savedUser ? JSON.parse(savedUser) : null
        } catch (error) {
            console.error('Unable to read user data:', error)
            return null
        }
    }, [])

    const [profile, setProfile] = useState({
        name:
            shopContext.user?.name ||
            storedUser?.name ||
            storedUser?.fullName ||
            '',
        email:
            shopContext.user?.email ||
            storedUser?.email ||
            '',
        phone:
            shopContext.user?.phone ||
            storedUser?.phone ||
            '',
        birthday:
            shopContext.user?.birthday ||
            storedUser?.birthday ||
            ''
    })

    const [formData, setFormData] = useState(profile)

    const [preferences, setPreferences] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true
    })

    useEffect(() => {
        try {
            const savedPreferences = localStorage.getItem('profilePreferences')

            if (savedPreferences) {
                setPreferences(JSON.parse(savedPreferences))
            }
        } catch (error) {
            console.error('Unable to read profile preferences:', error)
        }
    }, [])

    const initials = useMemo(() => {
        const name = profile.name?.trim()

        if (!name) {
            return 'OP'
        }

        return name.split(' ').filter(Boolean).slice(0, 2).map((word) => word[0].toUpperCase()).join('')
    }, [profile.name])

    const handleInputChange = (e) => {
        const { name, value } = e.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleEdit = () => {
        setFormData(profile)
        setIsEditing(true)
    }

    const handleCancel = () => {
        setFormData(profile)
        setIsEditing(false)
    }

    const handleSave = async (e) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            toastContext?.showToast?.(
                'Please enter your name.',
                'error'
            )
            return
        }

        if (!formData.email.trim()) {
            toastContext?.showToast?.(
                'Please enter your email address.',
                'error'
            )
            return
        }

        setIsSaving(true)

        try {
            const updatedProfile = {
                ...profile,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                birthday: formData.birthday
            }

            localStorage.setItem(
                'user',
                JSON.stringify({
                    ...storedUser,
                    ...updatedProfile
                })
            )

            if (typeof shopContext.updateUser === 'function') {
                await shopContext.updateUser(updatedProfile)
            }

            setProfile(updatedProfile)
            setIsEditing(false)

            toastContext?.showToast?.(
                'Your profile has been updated.',
                'success'
            )
        } catch (error) {
            console.error('Profile update error:', error)

            toastContext?.showToast?.(
                error?.message ||
                    'Unable to update your profile.',
                    'error'
            )
        } finally {
            setIsSaving(false)
        }
    }

    const handlePreferenceChange = (e) => {
        const { name, checked } = e.target

        const updatedPreferences = {
            ...preferences,
            [name]: checked
        }

        setPreferences(updatedPreferences)

        localStorage.setItem(
            'profilePreferences',
            JSON.stringify(updatedPreferences)
        )
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        if (typeof shopContext.logout === 'function') {
            shopContext.logout()
        }

        toastContext?.showToast?.(
            'You have been logged out.',
            'success'
        )

        navigate('/login')
    }

    return (
        <main className='profile-page'>
            <section className='profile-heading'>
                <div>
                    <p className='profile-eyebrow'>Your Account</p>
                    <h1>My Profile</h1>
                    <p className='profile-introduction'>
                        Manage your personal information, shopping activity and account preferences.
                    </p>
                </div>

                {!isEditing && (
                    <button
                        type='button'
                        className='profile-edit-button'
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button>
                )}
            </section>

            <section className='profile-layout'>
                <aside className='profile-summary-card'>
                    <div className='profile-avatar'>
                        {initials}
                    </div>

                    <h2>{profile.name || 'Opal customer'}</h2>
                    <p>{profile.email || 'No email provided'}</p>

                    <div className='profile-member-badge'>Opal Member</div>
                    <div className='profile-summary-divider'/>
                    <div className='profile-summary-detail'>
                        <span>Phone</span>
                        <strong>{profile.phone || 'Not added'}</strong>
                    </div>

                    <div className='profile-summary-detail'>
                        <span>Birthday</span>
                        <strong>{profile.birthday ? new Date(`${profile.birthday}T100:00:00`).toLocaleDateString('en-NZ', {day: 'numeric', month: 'long', year: 'numeric'}) : 'Not added'}</strong>
                    </div>
                </aside>

                <div className='profile-content'>
                    <section className='profile-card'>
                        <div className='profile-card-header'>
                            <div>
                                <p className='profile-section-label'>Personal details</p>
                                <h2>Account Information</h2>
                            </div>
                        </div>

                        {isEditing ? (
                            <form
                                className='profile-form'
                                onSubmit={handleSave}
                            >
                                <div className='profile-form-grid'>
                                    <div className='profile-field'>
                                        <label htmlFor='name'>Full Name</label>

                                        <input 
                                            id='name'
                                            name='name'
                                            type='text'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder='Enter your full name'
                                        />
                                    </div>

                                    <div className='profile-field'>
                                        <label htmlFor='email'>Email Address</label>

                                        <input
                                            id='email'
                                            name='email'
                                            type='email'
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder='Enter your email'
                                        />
                                    </div>

                                    <div className='profile-field'>
                                        <label htmlFor='phone'>Phone Number</label>
                                        
                                        <input
                                            id='phone'
                                            name='phone'
                                            type='tel'
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder='Enter your phone number'
                                        />
                                    </div>

                                    <div className='profile-field'>
                                        <label htmlFor='birthday'>Birthday</label>

                                        <input
                                            id='birthday'
                                            name='birthday'
                                            type='date'
                                            value={formData.birthday}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className='profile-form-actions'>
                                    <button
                                        type='button'
                                        className='profile-cancel-button'
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type='submit'
                                        className='profile-save-button'
                                        disabled={isSaving}
                                    >
                                        {isSaving
                                            ? 'Saving...'
                                            : 'Save changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className='profile-details-grid'>
                                <div className='profile-detail-item'>
                                    <span>Full Name</span>
                                    <strong>{profile.name || 'Not added'}</strong>
                                </div>

                                <div className='profile-detail-item'>
                                    <span>Email Address</span>
                                    <strong>{profile.email || 'Not added'}</strong>
                                </div>

                                <div className='profile-detail-item'>
                                    <span>Phone Number</span>
                                    <strong>{profile.phone || 'Not added'}</strong>
                                </div>

                                <div className='profile-detail-item'>
                                    <span>Birthday</span>
                                    <strong>{profile.birthday || 'Not added'}</strong>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className='profile-card'>
                        <div className='profile-card-header'>
                            <div>
                                <p className='profile-section-label'>Shopping</p>
                                <h2>Quick access</h2>
                            </div>
                        </div>

                        <div className='profile-links-grid'>
                            <Link
                                to='/orders'
                                className='profile-link-card'
                            >
                                <span className='profile-link-icon'>
                                    01
                                </span>

                                <div>
                                    <h3>My Orders</h3>
                                    <p>View order history and delivery status.</p>
                                </div>

                                <span className='profile-link-arrow'>
                                    →
                                </span>
                            </Link>

                            <Link 
                                to='/wishlist'
                                className='profile-link-card'
                            >
                                <span className='profile-link-icon'>
                                    02
                                </span>

                                <div>
                                    <h3>Wishlist</h3>
                                    <p>Review your saved Opal pieces.</p>
                                </div>
                                
                                <span className='profile-link-arrow'>
                                    →
                                </span>
                            </Link>

                            <Link
                                to='/cart'
                                className='profile-link-card'
                            >
                                <span className='profile-link-icon'>
                                    03
                                </span>

                                <div>
                                    <h3>Shopping Bag</h3>
                                    <p>Continue with the items in your cart.</p>
                                </div>

                                <span className='profile-link-arrow'>
                                    →
                                </span>
                            </Link>

                            <Link
                                to='/addresses'
                                className='profile-link-card'
                            >
                                <span className='profile-link-icon'>
                                    04
                                </span>

                                <div>
                                    <h3>Addresses</h3>
                                    <p>Manage your delivery addresses.</p>
                                </div>

                                <span className='profile-link-arrow'>
                                    →
                                </span>
                            </Link>
                        </div>
                    </section>

                    <section className='profile-card'>
                        <div className='profile-card-header'>
                            <div>
                                <p className='profile-section-label'>Preferences</p>
                                <h2>Communication settings</h2>
                            </div>
                        </div>

                        <div className='profile-preferences'>
                            <label className='profile-preference-row'>
                                <div>
                                    <strong>Order Updates</strong>
                                    <span>Recieve delivery and order status updates.</span>
                                </div>

                                <input 
                                    type='checkbox'
                                    name='orderUpdates'
                                    checked={preferences.orderUpdates}
                                    onChange={handlePreferenceChange}
                                />

                                <span className='profile-toggle'/>
                            </label>

                            <label className='profile-preference-row'>
                                <div>
                                    <strong>Promotions</strong>
                                    <span>Receive offers and seasonal promotions</span>
                                </div>

                                <input
                                    type='checkbox'
                                    name='promotions'
                                    checked={preferences.promotions}
                                    onChange={handlePreferenceChange}
                                />
                                
                                <span className='profile-toggle'/>
                            </label>

                            <label className='profile-preference-row'>
                                <div>
                                    <strong>Newsletter</strong>
                                    <span>Recieve Opal styling news and collection updates.</span>
                                </div>

                                <input 
                                    type='checkbox'
                                    name='newsletter'
                                    checked={preferences.newsletter}
                                    onChange={handlePreferenceChange}
                                />

                                <span className='profile-toggle'/>
                            </label>
                        </div>
                    </section>

                    <section className='profile-card profile-security-card'>
                        <div>
                            <p className='profile-section-label'>Security</p>
                            <h2>Password and Account</h2>
                            <p>Keep your account secure by regularly updating your password.</p>
                        </div>

                        <div className='profile-security-actions'>
                            <Link
                                to='/change-password'
                                className='profile-password-button'
                            >
                                Change Password
                            </Link>

                            <button
                                type='button'
                                className='profile-logout-button'
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </div>
                    </section>
                </div>
            </section>
        </main>
    )
}

export default Profile