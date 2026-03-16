import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [validaction, setValidaction] = useState("")


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setValidaction("Enter email");
      return
    }
    if (!password) {
      setValidaction("Enter password");
      return;
    }

    try {

      const res = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = res.user

      toast.success("Login successful")

      setEmail("")
      setPassword("")

      navigate("/")

    } catch (error) {
      if (error instanceof Error) {
        setValidaction(error.message);

        setTimeout(() => {
          setValidaction("");
        }, 3000);
      }

      console.error(error);
    }

  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
        // background: "#f5f5f5",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          {validaction && <p className="text-red-600 mt-2 text-sm">{validaction}</p>}


          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Login
          </button>

          <p style={{ marginTop: "15px", textAlign: "center" }}>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;