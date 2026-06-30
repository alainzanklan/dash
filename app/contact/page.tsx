'use client'

import Inputs from "../components/inputs/Inputs";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../components/Heading";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import Link from "next/link";
import {FaLocationDot, FaMessage} from "react-icons/fa6"
import { FaPhone } from "react-icons/fa";

const ContactUsPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FieldValues>({
        defaultValues: {
          name: "",
          email: "",
          Message: "",
        },
      });
    
      const router = useRouter();

      const onSubmit = () => {}
  return (
    <Container>
      <div className="p-8"><Heading title="Contact Us" center/></div>
      
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> 
            <div className="pt-8 md:pt-35 flex flex-col gap-8">
                <div className="grid grid-cols-4 gap-2 border-b border-b-blue-200 ">
            <div className=" col-span-3  p-2"> 
                <h2 className="font-semibold mb-2">Main Office</h2>
                <p className="">6 switchback road, 37, Accra </p>
                 </div>
                 <div className="text-center mt-3 text-red"><FaLocationDot size={50} color="#075985"/> </div>
                 </div>
        <div className="grid grid-cols-4 p-2 gap-2 border-b border-b-blue-200"> 
          <div className="flex flex-col gap-2 col-span-3">
            <h2 className="font-semibold">Phone Number</h2>
            <span className="text-blue-600 hover:text-blue-700"><Link href="tel:+233245022140">0245022140</Link></span>
            <span className="text-blue-600 hover:text-blue-700"> <Link href="tel:+233205708827">0205708827</Link></span>
            </div>
            <div className="text-center mt-3 text-red"><FaPhone size={50} color="#075985"/> </div>
         </div>
        <div className=" grid grid-cols-4 gap-2 p-2 border-b border-b-blue-200 mb-[-20px]"> 
          <div className="col-span-3">
            <h2 className="font-semibold mb-2">Email</h2> 
            <Link href="mailto:info@emartgh.com"> info@emartgh.com </Link></div>
            <div className="text-center mt-3 text-red"><FaMessage size={50} color="#075985"/> </div>
            </div>
            </div>
            <div className="col-span-2"> 
                
        <div className=" pt-12 px-4 md:px-24">
              
      <h2 className="font-bold text-xl py-1 text-center mb-2 ">Any questions or remarks, just write us a message!</h2>
      <hr className="bg-slate-300 w-full h-px mb-8  text-blue-200" />
      <div className="flex flex-col gap-6">
      <Inputs
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Inputs
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
         <Inputs
        id="message"
        label="Message"
        type="text"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
       <Button
        label={isLoading ? "loading..." : "Send"}
        onClick={handleSubmit(onSubmit)}
      />
      </div>
        </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3 ">
       
      </div>
    </Container>
    
  )
}

export default ContactUsPage
