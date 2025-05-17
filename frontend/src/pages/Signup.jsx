import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers";
import { Link } from "react-router-dom";
import { Code, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import {z} from "zod"

const signUpSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be atleast 6 character."),
    name: z.string().min(3, "Name must be at least 3 character.")
})

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {error},

    } = useForm({resolver: zodResolver(signUpSchema)})

    const onSubmit = async (data)=>{
        console.log(data)
    }
  return <div className="h-screen grid lg:grid-cols-2" >

  </div>;
}
