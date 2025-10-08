
'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase"; 
import { useRouter } from "next/navigation"; 

const Login = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const text = "Welcome to Lodgelink, where finding your perfect home is just a click away. Sign in to access your personalized dashboard, manage listings, and stay connected with trusted landlords and tenants."
    const shortText = text.split('.')[0] + '.'

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            await redirectUser(user.uid);
        } catch (error: unknown) { 
            setError(error.message || "An error occurred during login");
        }
    }
      //---------------- Google Login ----------------
const handleGoogleLogin = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);
        await redirectUser(user.uid);
    } catch (error: unknown) {
        setError(error.message || "An error occurred during Google login");
    }
};


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
  // ---------------- Listen for user session ----------------
       useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async (user) =>{
            if(user){
                await redirectUser(user.uid);
            }
            setLoading(false);
        }, []);
        return () => unsubscribe();
       })

       // ---------------- Redirect User after Login ----------------
  const redirectUser = async (uid: string) => {
    try {
      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists()) {
        const userData = userSnap.data();

        // store user profile in localStorage (or context/provider)
        localStorage.setItem("userProfile", JSON.stringify(userData));

        if (userData.role === "admin") {
          router.push("/admin");
        } else if (userData.role === "landlord") {
          router.push("/landlord");
        } else if (userData.role === "student") {
          router.push("/dashboard");
        } else {
          setError("Your role is not assigned correctly.");
        }
      } else {
        setError("No user profile found.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user data.");
    }
  };

if (loading) {
    return <p className="text-center mt-10 blinking">Loading...</p>;
  }
    return (
        <div className='bg-[#0025cc] w-[80%] m-auto rounded-lg mt-5 mb-5'>
            <div className="grid grid-cols-1 sm:grid-cols-2 w-[80%] gap-3 m-auto rounded-lg">
                <div className="relative rounded-lg pl-10 pr-10 py-5 mt-4 mb-4 bg-cover bg-center object-contain" style={{ backgroundImage: "url('/part.jpg')" }}> 
                    <span className='absolute  inset-0 z-0'></span>
                    <div className="flex items-center justify-start gap-2 mt-7"> 
                        <p><Image src="/logo.png" alt="Lodgelink logo" width={30} height={30} className="" /></p>
                        <h1 className='font-bold text-[#0025cc] '>Lodgelink</h1>
                    </div>
                    <div className="flex flex-col leading-none mt-15">
                        <h1 className='text-[#0025cc] text-[60px]'>Hello,</h1>
                        <h1 className='text-[#0025cc] text-[60px]'><b>Welcome!</b></h1>
                    </div>
                    <div className="mt-7">
                        <h3 className='text-white sm:text-[20px] text-[15px] font-semibold'>{isOpen ? text : shortText}</h3>
                        <button className="bg-[#00db00] text-white rounded-lg px-3 py-2 mt-4 cursor-pointer hover:bg-[#00db00]/80" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'View less' : 'View More'}</button>
                    </div>
                </div>
                <div className="bg-[#9faffa] rounded-lg bg-cover bg-center object-contain mt-4 mb-4" style={{backgroundImage: "url('/part2.png')"}}>
                    <div className="rounded-lg">
                        <form onSubmit={handleEmailLogin} className='mb-4 w-[80%] m-auto py-15 '>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex items-center gap-2 bg-white px-2 rounded-lg">
                                <FaUser size={20} className='text-[#2e4cd5]' />
                                <input
                                    type="email"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter Your Email"
                                    className='w-full bg-white py-2 outline-none '
                                    required
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password "
                                    className='w-full bg-white rounded-lg px-3 py-2 pr-10 outline-none mt-5'
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-0  hover:text-blue-700"
                                >
                                    {showPassword ? <FaEyeSlash size={20} className='text-[#2e4cd5]' /> : <FaEye size={20} className='text-[#2e4cd5]' />}
                                </button>
                            </div>
                            <div className="flex justify-between mt-5">
                                <div className="flex gap-2 items-center">
                                    <p><input type="checkbox"  /></p>
                                    <p className='text-[#2e4cd5]  text-[20px] sm:text-[15px]'>Remember Me</p>
                                </div>
                                <Link href="/forgotten" className=' text-[20px] sm:text-[15px] text-[#ffffff]'>Forgotten Password</Link>
                            </div>
                            <button type='submit' className='cursor-pointer w-full bg-[#697fe1] hover:bg-[#0025cc] transition ease-in-out duration-300 text-white py-2 rounded-lg'>Login with Email</button>
                            <div className="flex items-center gap-1 mt-2">
                                <hr className="border-white flex-grow" />
                                <p className="text-white">Or</p>
                                <hr className="border-white flex-grow" />
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="cursor-pointer w-full bg-[#ffffff] hover:bg-[#0025cc] transition ease-in-out duration-300 text-[#697fe1] py-2 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Image src="/google.png" alt="Google" width={30} height={30} />
                                    Continue with Google
                                </button>
                            </div>
                            <div className="flex items-center gap-3 m-auto">
                                <p className="text-[#000000]  text-[20px] sm:text-[15px]">Not a member yet?</p>
                                <div className="flex items-center py-2 transition ease-in-out duration-300">
                                    <Link href="/register" className='hover:text-[#0025cc] text-[#ffffff] transition duration-300 ease-in-out'>Sign Up</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login