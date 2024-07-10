import signup from '../assets/icons/signup.svg'
import signupDark from '../assets/icons/signupDark.svg'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import lightWelcome from "../assets/icons/nothing.svg"
import welcomeDark from '../assets/icons/welcomeDark.svg'
import { useState } from 'react'
import { useSignupMutation } from '../rtk-query/apiSlice';

interface FormDataState {
    name: string | null,
    email: string | null,
    password: string | null
}

type ErrorState = boolean;

type ErrorMsgState = string | null ;

export default function Signup(){ 
    const [formData, setFormData] = useState<FormDataState>({
        name: null,
        email: null,
        password: null
    });
    const navigate = useNavigate();
    const [ addUser, {isLoading}] = useSignupMutation();
    const [errorMsg, setErrorMsg] = useState<ErrorMsgState>(null);
    const [error, setError] = useState<ErrorState>(false);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        
        if(!formData.name 
            || !formData.email 
            || !formData.password 
            || formData.name === '' 
            || formData.email === '' 
            || formData.password === '')
            {   
                setError(true);
                setErrorMsg('All fields are required');
                return ;
            }

        try{
            setError(false);
            setErrorMsg(null);

            await addUser(formData).unwrap();
            navigate('/signin');

        } catch (error : unknown){
            console.log(error); 
            
            setError(true);
            setErrorMsg("Email already in use");
        }
    }

    return (
        <div className='flex flex-col max-w-4xl min-h-screen p-3 pt-3 md:flex-row md:justify-center md:items-center md:mx-auto'>
            <div className='flex-1 hidden md:block '>
            <div className="flex justify-center flex-1 ">
                <img src={lightWelcome} alt="" className="dark:hidden"/>
                <img src={welcomeDark} alt="" className="hidden dark:block"/>
            </div>
            </div>
            <div className='flex-1'>
                <Link to={"/"} className='flex items-center gap-2 md:hidden'>
                    <ChevronLeft className='text-neutralActive dark:text-neutralOffWhite'/>
                    <h3 className='subheading-1'>Sign Up</h3>
                </Link>
                <h1 className='hidden text-center heading-2 md:block'>Sign Up</h1>
            <div className='pt-14 md:pt-5'>
                <div className='flex flex-col items-center'>
                    <img src={signup} alt="" className='dark:hidden'/>
                    <img src={signupDark} className='hidden dark:block'></img>
                </div>
                <div className='w-full pt-7'>
                    <form action="" className='flex flex-col items-center w-full gap-3'  onSubmit={handleSubmit}>
                        <input type="text" placeholder='Name (Required)' name='name' id='name'
                        className='w-full p-3 rounded-md outline-none focus-within:border-2 body-text-1 focus-within:border-neutralLine h-9 bg-neutralOffWhite dark:bg-neutralDark dark:placeholder:text-neutralOffWhite dark:focus-within:border-neutralWeak'  onChange={handleChange}/>
                        <input type="email" placeholder='Email (Required)' name='email' id='email'
                        className='w-full p-3 rounded-md outline-none focus-within:border-2 body-text-1 focus-within:border-neutralLine h-9 bg-neutralOffWhite dark:bg-neutralDark dark:placeholder:text-neutralOffWhite dark:focus-within:border-neutralWeak' onChange={handleChange}/>
                        <input type="text" placeholder='Password (Required)' name='password' id='password'
                        className='w-full p-3 rounded-md outline-none focus-within:border-2 body-text-1 focus-within:border-neutralLine h-9 bg-neutralOffWhite dark:bg-neutralDark dark:placeholder:text-neutralOffWhite dark:focus-within:border-neutralWeak' onChange={handleChange}/>
                        <div className='absolute flex flex-col justify-center w-full gap-2 p-3 bottom-5 md:relative md:pt-7'>
                            <button className="bg-brandDefault text-neutralOffWhite flex justify-center rounded-full hover:bg-brandDark  focus:bg-brandDefault focus:shadow-[0px_0px_10px_10px] focus:shadow-brandBackground outline-none py-3 md:py-3 w-full disabled:bg-brandLight dark:bg-brandDarkMode dark:hover:bg-brandDefault dark:disabled:bg-blue-400
                            " disabled={isLoading}>
                            Sign Up
                            </button>
                            {
                                error && (
                                    <div>
                                        <p className='ml-2 text-accentDanger dark:text-red-500'>{errorMsg}</p>
                                    </div>
                                )
                            }
                            <div className='flex justify-between'>
                            <p className='pl-2 body-text-1'>Have an account already? <Link to={"/signin"} className='text-green-500'>
                            Sign in
                            </Link>
                            </p>
                            <p className='hidden pr-2 md:inline body-text-1 text-accentDanger'><Link to={"/"}>Return</Link></p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}