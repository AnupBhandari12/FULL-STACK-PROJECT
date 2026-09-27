import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "./firebase/firebase";
import Login from "./components/Login";
import Register from "./components/Register";
import PostForm from "./components/PostForm";
import PostList from "./components/PostList"

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div>
        {authMode === "login" ? (
          <>
            <Login />

            <button
              onClick={() => setAuthMode("register")}
              className="ml-6 border p-2 rounded"
            >
              Create Account
            </button>
          </>
        ) : (
          <>
            <Register />

            <button
              onClick={() => setAuthMode("login")}
              className="ml-6 border p-2 rounded"
            >
              Already have an account? Login
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-4">Logged in as: {user.email}</p>

      <button onClick={handleLogout} className="border p-2 rounded mt-4">
        Logout
      </button>

      <PostForm user={user} />
      <hr/>
      <PostList user={user} />
    </div>
  );
}

export default App;
