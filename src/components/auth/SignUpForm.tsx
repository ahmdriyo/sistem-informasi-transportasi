'use client'
import Checkbox from '@/components/form/input/Checkbox'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import { baseApi } from '@/data/consts/base-api'
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons'
import Link from 'next/link'
import React, { useState } from 'react'
// import { message } from 'antd';
import { useRouter } from 'next/navigation'
import { ModalSucces } from '../modal/succes/ModalSucces'
export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await baseApi.post('/auth/signup', {
        name,
        email,
        password,
      })
      setIsModalOpen(true)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }
  const handleSucces = () => {
    router.push('/auth/login')
    setIsModalOpen(false)
  }
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <ModalSucces opened={isModalOpen} title="Sign up was successful, please login again!" onClose={handleSucces} />
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email and password to sign up!</p>
          </div>
          <div>
            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                <div>
                  <Label>
                    Full Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      defaultValue={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{' '}
                    <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span> and our{' '}
                    <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                  </p>
                </div>
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
