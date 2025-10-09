'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import {
  createUserWithEmailAndPassword,

  GoogleAuthProvider,
  signInWithPopup,
  
} from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase';
import { finalizeSessionAndRedirect } from '@/app/utils/auth';
import { useRouter } from 'next/navigation';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

type Role = 'student' | 'landlord' | 'admin';

const Page = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('student');
  const [superkey, setSuperkey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  // ---- Email/password sign up ----
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateRole()) return;
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUserDoc(user.uid, {
        email,
        name: `${firstName} ${lastName}`.trim(),
        profileImage: user.photoURL || '',
        role,
      });

      // set session cookies + redirect
      await finalizeSessionAndRedirect(router);
    } catch (err: unknown) {
      setError(err?.message || 'Email sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Google sign up ----
  const handleGoogleSignup = async () => {
    setError('');
    if (!validateRole()) return;

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      await ensureUserDoc(user.uid, {
        name: user.displayName || '',
        email: user.email || '',
        profileImage: user.photoURL || '',
        role,
      });

      await finalizeSessionAndRedirect(router);
    } catch (err: unknown) {
      setError(err?.message || 'Google sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  // ---- Helper to ensure Firestore doc ----
  const ensureUserDoc = async (uid: string, data: Record<string, unknown>) => {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const existing = snap.data();
      await setDoc(
        ref,
        {
          ...existing,
          ...data,
          role: data.role ?? (existing as unknown).role ?? 'student',
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      await setDoc(ref, {
        uid,
        createdAt: serverTimestamp(),
        ...data,
      });
    }
  };

  // ---- Role validation ----
  const validateRole = () => {
    if (role === 'landlord' && superkey !== 'superland') {
      setError('Incorrect Landlord code.');
      return false;
    }
    if (role === 'admin' && superkey !== 'superadmin') {
      setError('Incorrect Admin code.');
      return false;
    }
    return true;
  };

   const text = "Welcome to Lodgelink, where finding your perfect home is just a click away. Sign in to access your personalized dashboard, manage listings, and stay connected with trusted landlords and tenants."
    const shortText = text.split('.')[0] + '.'
  return (
    <div>
      <Navbar />
      <div className="  bg-[#0025cc] w-full sm:w-[80%] mt-10 mb-10 m-auto rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center ">
          <div className="relative w-[90%] sm:ml-13 bg-white rounded-lg pl-10 m-auto pt-10 pb-10 mt-4 mb-4 bg-cover bg-center object-contain"> 
            <span className='absolute   inset-0 z-0'></span>
              <div className="flex items-center justify-start gap-2 pb-15 "> 
                <p><Image src="/logo.png" alt="Lodgelink logo" width={30} height={30} className="" /></p>
                <h1 className='font-bold text-[#0025cc] '>Lodgelink</h1>
              </div>
              <div className="flex flex-col leading-none mt-10 pb-10">
                  <h1 className='text-[#0025cc] text-[60px]'>Hello,</h1>
                  <h1 className='text-[#0025cc] text-[60px]'><b>Welcome!</b></h1>
              </div>
              <div className="mt-10">
                  <h3 className='text-[#0025cc] sm:text-[20px] text-[15px] font-semibold'>{isOpen ? text : shortText}</h3>
                  <button type='button' className="bg-[#00db00] text-white rounded-lg px-3 py-2 mt-4 cursor-pointer hover:bg-[#00db00]/80" onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'View less' : 'View More'}</button>
              </div>
          </div>

          <div
            className="w-full sm:w-[90%] mt-4 mb-4 rounded-lg bg-cover object-cover bg-center"
            style={{ backgroundImage: 'url(/part2.png)' }}
          >
            <form onSubmit={handleEmailSignup} className="items-center px-8 py-4">
              <label className="text-[20px] text-[#0025cc] font-semibold">Sign In</label>

              <div className="grid grid-cols-2 items-center gap-4 mt-2">
                <input
                  type="text"
                  required
                  value={firstName}
                  placeholder="Your First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="rounded p-1 active:border-[#00db00] outline-none bg-white text-[#0025cc]"
                />
                <input
                  type="text"
                  required
                  value={lastName}
                  placeholder="Your Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  className="rounded p-1 active:border-[#00db00] outline-none bg-white text-[#0025cc]"
                />
              </div>

              <div className="mb-4">
                <label className="block mt-3 mb-2 font-semibold text-[15px] sm:text-[20px] text-[#0025cc]">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="rounded text-[#0025cc] w-full border-none bg-white outline-none p-2"
                >
                  <option value="student">Student</option>
                  <option value="landlord">Landlord</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {(role === 'landlord' || role === 'admin') && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder={role === 'admin' ? 'Enter Admin code' : 'Enter Landlord code'}
                    value={superkey}
                    onChange={(e) => setSuperkey(e.target.value)}
                    className="w-full border p-2 rounded bg-red-100 text-[#0025cc]"
                  />
                </div>
              )}

              <input
                type="email"
                value={email}
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded py-2 outline-none active:border-[#00db00] bg-white text-[#0025cc] w-full mt-3"
                required
              />
              <input
                type="password"
                value={password}
                placeholder="Create a Password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded py-2 outline-none active:border-[#00db00] bg-white text-[#0025cc] w-full mt-5"
                required
              />

              <div className="flex items-center gap-2 mt-3">
                <input type="checkbox" id="terms" className="w-4 h-4 accent-[#0025cc]" />
                <label
                  htmlFor="terms"
                  className="text-[15px] sm:text-sm text-[#ffffff]"
                >
                  I’ve read and agree to the{' '}
                  <span className="underline cursor-pointer text-[#00db00]">Terms of Service</span>{' '}
                  and{' '}
                  <span className="underline cursor-pointer text-[#00db00]">Privacy Policy</span>.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded py-2 cursor-pointer mt-3 bg-[#00db00] text-white font-bold text-[17px] sm:text-[20px]"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="flex items-center mb-2 mt-2">
                <hr className="flex-grow text-white" />
                <p className="text-white px-2">Or</p>
                <hr className="flex-grow text-white" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="flex items-center justify-center gap-3 bg-white w-full border border-[#0025cc] rounded-md py-2 hover:bg-[#9faffa] cursor-pointer transition duration-500 ease-in-out"
              >
                <Image src="/google.png" width={24} height={24} alt="Google logo" />
                <p className="text-[#0025cc] font-medium">
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </p>
              </button>

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}

              <p className="text-[#ffffff] text-[15px] mt-4">
                Already have an account?{' '}
                <Link className="text-[#00db00] text-[17px]" href="/login">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
