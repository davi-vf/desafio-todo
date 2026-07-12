import { useState } from 'react'
import { registerUser } from '../services/api.js'
import { isValidEmail } from '../utils/email.js'

export default function Register({ onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleRegister(event) {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName || !trimmedEmail || !password) {
      setErrorMessage('Nome, e-mail e senha são obrigatórios.')
      return
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Informe um e-mail válido (ex: voce@email.com).')
      return
    }

    if (trimmedName.length > 80) {
      setErrorMessage('O nome deve ter no máximo 80 caracteres.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setIsSubmitting(true)

    try {
      await registerUser({ name: trimmedName, email: trimmedEmail, password })
      setSuccessMessage('Conta criada! Faça login para continuar.')
      setTimeout(() => onSwitchToLogin(), 1200)
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Não foi possível criar a conta. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <div className="auth-input-group">
        <label className="auth-label" htmlFor="register-name">
          Nome
        </label>
        <input
          id="register-name"
          type="text"
          className="auth-input"
          placeholder="Seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          required
          autoFocus
        />
      </div>

      <div className="auth-input-group">
        <label className="auth-label" htmlFor="register-email">
          E-mail
        </label>
        <input
          id="register-email"
          type="email"
          className="auth-input"
          placeholder="voce@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="auth-input-group">
        <label className="auth-label" htmlFor="register-password">
          Senha
        </label>
        <input
          id="register-password"
          type="password"
          className="auth-input"
          placeholder="Mínimo 6 caracteres"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
      </div>

      {errorMessage && <p className="auth-feedback-error">{errorMessage}</p>}
      {successMessage && <p className="auth-feedback-success">{successMessage}</p>}

      <button type="submit" className="btn-auth-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar conta'}
      </button>

      <p className="helper-text-muted">
        Já tem conta?
        <button type="button" className="link-action-bold" onClick={onSwitchToLogin}>
          Entrar
        </button>
      </p>
    </form>
  )
}
