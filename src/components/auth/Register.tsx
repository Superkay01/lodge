// components/auth/register.tsx
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; 
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user role to Firestore
      await setDoc(doc(db, "users", user.uid), {
        role: role,
        email: user.email,
      });

      router.push("/dashboard"); // Redirect to the dashboard after registration
    } catch (err) {
      setError("Registration failed: " + err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="landlord">Landlord</option>
        </select>
        <button type="submit">Sign up</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
