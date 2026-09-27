import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase/firebase"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        )

      const user = userCredential.user

      console.log("UID:", user.uid)
      console.log("Email:", user.email)

      setSuccess("Login successful")
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">
        Login
      </h2>

      <form
        onSubmit={handleLogin}
        className="mt-4"
      >
        <div className="mb-4">
          <label className="block mb-1">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="border p-2 rounded"
        >
          Login
        </button>
      </form>

      {error && (
        <p className="mt-4">
          {error}
        </p>
      )}

      {success && (
        <p className="mt-4">
          {success}
        </p>
      )}
    </div>
  )
}

export default Login