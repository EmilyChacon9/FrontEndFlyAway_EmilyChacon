import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LogIn() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [alert, setAlert] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setAlert(null);

        if (!email.trim() || !password.trim()) {
            setError('Por favor, ingresar email y contraseña.');
            return;
        }

        setSubmitting(true);

        try {
            const response = await api.post('/auth/login', { email, password });

            const token = response.data.token; 

            setAlert('¡Inicio de sesión exitoso! Redirigiendo...');

            if (token) {
                localStorage.setItem('token', token);
            }

            setTimeout(() => {
                navigate('/flights/search'); 
            }, 1500);

        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError('Credenciales incorrectas o error de servidor.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Log In</h2>
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
                    {submitting ? 'Iniciando sesión...' : 'Log In'}
                </button>
            </form>

            <div className="auth-switch">
                ¿No tienes una cuenta aún?{' '}
                <button type="button" onClick={() => navigate('/users/register')} disabled={submitting}>
                    Registrarse
                </button>
            </div>
        </div>
    );
}

export default LogIn;