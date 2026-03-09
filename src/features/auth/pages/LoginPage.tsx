import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/auth-store'
import { track } from '../../../lib/tracking'
import { AuthLayout } from '../components/AuthLayout'
import { loginSchema, type LoginSchema } from '../schema'
import * as authApi from '../api'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    track('page_view', { page: 'login' })
  }, [])

  const onSubmit = async (data: LoginSchema) => {
    try {
      const { user, token } = await authApi.login(data.email, data.password)
      setAuth(user, token)
      track('login', { method: 'email', userId: user.id })
      navigate('/', { replace: true })
    } catch {
      setError('root', { message: t('auth.errorInvalidCredentials') })
      track('login_fail', { reason: 'invalid_credentials' })
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errors.root && (
          <p className="rounded-[14px] bg-red-50 px-4 py-3 text-sm text-red-600">{errors.root.message}</p>
        )}

        <div>
          <label className="mb-1.5 block text-[16px] font-bold uppercase tracking-[1px] text-slate-400">
            {t('auth.email')}
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-[60px] w-full rounded-[14px] border-0 bg-slate-100 px-4 text-[20px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-2 focus:border-blue-500 focus:bg-white focus:outline-none"
            {...registerField('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-[16px] font-bold uppercase tracking-[1px] text-slate-400">
            {t('auth.password')}
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-[60px] w-full rounded-[14px] border-0 bg-slate-100 px-4 text-[20px] font-semibold text-slate-900 placeholder:text-slate-400 focus:border-2 focus:border-blue-500 focus:bg-white focus:outline-none"
            {...registerField('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[60px] w-full max-w-[452px] rounded-[12px] bg-blue-500 text-[18px] font-bold uppercase text-white shadow-glow hover:bg-blue-600 disabled:opacity-60"
        >
          {isSubmitting ? t('common.loading') : t('auth.submitLogin')}
        </button>
      </form>

      <p className="mt-6 text-[16px] text-slate-700">
        {t('auth.forgotPassword', 'Forgot your password?')}{' '}
        <a href="#" className="font-bold text-blue-600 underline hover:text-blue-700">
          {t('auth.resetHere', 'Reset Here')}
        </a>
      </p>

      <Link
        to="/register"
        className="mt-6 flex h-[60px] w-full items-center justify-center rounded-[12px] bg-blue-50 text-[18px] font-bold uppercase text-blue-600 hover:bg-blue-100"
      >
        {t('auth.goRegister')}
      </Link>
    </AuthLayout>
  )
}
