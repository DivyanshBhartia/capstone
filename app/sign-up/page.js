'use client'

import { useState, useEffect } from "react";
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";

export default function SignUp() {
  const [username , setUsername] = useState('')
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [submited , setSubmitted] = useState(false)
  const [error , setErrors] = useState({})
  const route = useRouter() ;
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);


  const validate = () => {
    const newError = {}
    if (!username.trim().length) {newError.username = 'Username is required'}
    if (!email.includes('@')) {newError.email = 'Invalid email'}
    if (password.length < 6) {newError.password = 'password must be atleast 6 characters '}
    return newError ; 
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length > 0) return;
  
    try {
      const userCredential = await createUserWithEmailAndPassword(email, password);
      if (userCredential?.user) {
        await updateProfile(userCredential.user, {
          displayName: username
        });
        route.push('/');
      }
    } catch (err) {
      console.error("Firebase Error:", err.message);
      setErrors(prev => ({ ...prev, firebase: err.message }));
    }
  };


  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  }


  return (
    <>
      <div className="h-[100vh] flex justify-center items-center bg-gray-100">
          <div className="h-[60vh] w-[50vh] shadow-2xl rounded-2xl bg-white text-black  flex   flex-col justify-start pt-[4%] gap-6 items-center">
            <div className="w-[80%] flex flex-col gap-2">
              <Label>Username</Label>
              <Input className="border-black  "
              name = 'username'
                  type= 'text'
                  value = {username}
                  onChange = {(e)=>handleChange(e)}
                  required
                />
              {error.username && <p className="text-red-500 text-sm">{error.username}</p>}
            </div>
            <div className="w-[80%] flex flex-col gap-2">
              <Label>Email</Label>
              <Input className="border-black"
                name = 'email'
                type= 'email'
                value = {email}
                onChange = {(e)=>handleChange(e)}
                required
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>
            <div className="w-[80%] flex flex-col gap-2">
              <Label>Password</Label>
              <Input className="border-black"
                name = 'password'
                type= 'password'
                value = {password}
                onChange = {(e)=>handleChange(e)}
                required
              />
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>
            <div className="flex gap-2 " >
            <Button className="bg-orange-500 font-semibold text-sm hover:bg-orange-600" onClick = {(e)=>handleSubmit(e)}>Register</Button>
            </div>
            <div className="mt-6">
              <span className="text-gray-600">Already have an account ? </span>
              <Button variant="ghost" className="text-gray-800" onClick = {()=>route.push('/')}>Login Here</Button>
            </div>
          </div>
      </div>
      {error.firebase && <p className="text-red-500 text-sm">{error.firebase}</p>}
    </>
  )
}
