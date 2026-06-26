import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setAlert(null);

        if (!email.trim() || !name.trim() || !lastname.trim() || !password.trim()) {
            setError('Por favor, completar todos los campos.');
            return;
        }

        setSubmitting(true);

        try {
            await api.post('/users/register', {
                email: email,
                username: email, 
                firstName: name, 
                lastName: lastname, 
                password: password
            });
            setAlert('Usuario registrado exitosamente :D');

            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);

        } catch (err: any) {
            if (err.response) {
                if (err.response.data && err.response.data.detail) {
                    setError(err.response.data.detail);
                } else if (err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error en los datos. Recuerda: Nombre/Apellido con Mayúscula inicial y Password de 8+ caracteres.');
                }
            } else {
                setError('El servidor está apagado o inalcanzable.'); // es chistoso las veces que me pasó, así que por si acaso
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {error && <div className="alert-error">{error}</div>}
            {alert && <div className="alert-success">{alert}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastname">Apellido:</label>
                    <input
                        type="text"
                        id="lastname"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <button type="submit" className="btn-submit" disabled={submitting}>
                    {submitting ? 'Registrando...' : 'Register'}
                </button>
            </form>

            <div className="auth-switch">
                ¿Ya tienes una cuenta?{' '}
                <button type="button" onClick={() => navigate('/auth/login')} disabled={submitting}>
                    Log In
                </button>
            </div>
        </div>
    );
}

export default Register;