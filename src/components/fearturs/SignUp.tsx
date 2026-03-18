import React, { useState } from "react"
import toast from "react-hot-toast"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

type FormData = {
  firtsName : string
  lastName: string
  email: string
  password: string
}

type FormErrors = {
  firtsName ?: string
  lastName?: string
  email?: string
  password?: string
}

const initialFormData: FormData = {
  firtsName : "",
  lastName: "",
  email: "",
  password: ""
}

const SignUp = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}

    if (!formData.firtsName .trim()) {
      newErrors.firtsName = "Please fill first name"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please fill last name"
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email"
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)

      setTimeout(() => {
        setErrors({})
      }, 3000)

      return
    }

    try {
      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        firtsName : formData.firtsName ,
        lastName: formData.lastName,
        email: formData.email
      })

      setFormData(initialFormData)

      toast.success("Account created successfully")

      navigate("/")

    } catch (error) {
      if (error instanceof Error) {
        setErrors({ email: error.message })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center    px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Create Account
        </h1>

        <input
          type="text"
          name="firtsName"
          placeholder="First Name"
          value={formData. firtsName }
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.firtsName && (
          <p className="text-red-500 text-sm">{errors.firtsName }</p>
        )}

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white w-full p-2 rounded mt-2 hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

          <p className="text-sm text-center mt-4">
            Already have a account?{" "}
            <Link
              to="/login"
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>

      </form>

    </div>
  )
}

export default SignUp