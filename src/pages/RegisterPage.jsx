import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const { signUp, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')

    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden')
      return
    }

    const success = await signUp(email, password)
    if (success) navigate('/')
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">UniSchedule</h1>
          <p className="text-gray-500 mt-2">Crea tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Registro</h2>

          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex justify-between items-center">
              <span>{displayError}</span>
              <button onClick={() => { clearError(); setLocalError('') }} className="text-red-400 hover:text-red-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@universidad.cl"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Crear cuenta
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
