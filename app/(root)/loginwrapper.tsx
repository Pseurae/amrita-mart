"use client"

import { FormEvent, InputHTMLAttributes, useState } from "react";
import { useUserContext } from "@/context/user"
import { LoginStatus, RegisterStatus } from "@/types/user";
import { Modal } from "@/components/Modal";

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons'

import { motion } from "framer-motion";
import { PopupAnimationVariants } from "@/libs/common";

enum UsernameErrors {
    Empty,
    Invalid,
    AlreadyExists
};

enum FullnameErrors {
    Empty
};

enum EmailErrors {
    Empty,
    NeedProperEmail,
    StudentEmail
};

enum PasswordErrors {
    Empty,
    TooShort,
    Invalid
};

type LoginErrors = {
    username: UsernameErrors | null;
    password: PasswordErrors | null;
};

type RegisterErrors = LoginErrors & {
    fullname: FullnameErrors | null;
    email: EmailErrors | null;
};

const UsernameErrorStrings = [
    "Username can't be empty.",
    "Username doesn't exist!",
    "Username already exists!"
];

const FullnameErrorStrings = [
    "Name can't be empty."
];

const EmailErrorStrings = [
    "Email can't be empty.",
    "Please enter a valid email.",
    "Needs a student email!"
];

const PasswordErrorStrings = [
    "Password can't be empty.",
    "Password can't have less than 8 characters.",
    "Wrong password!"
];

const textInputClasses = "border-b border-gray-200 outline-none px-3 py-2 block w-full focus:border-blue-500";
const passwordInputClasses = "border-b border-gray-200 outline-none pl-3 pr-10 py-2 block w-full focus:border-blue-500";
const buttonClasses = "mt-4 w-80 border-2 transition enabled:hover:text-white disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed py-2 font-semibold rounded-full";

const loginButtonClasses = "enabled:text-blue-400 enabled:border-blue-400 enabled:hover:bg-blue-400";
const registerButtonClasses = "enabled:text-green-400 enabled:border-green-400 enabled:hover:bg-green-400";

type InputProps = { error: number | null, errorMessages: string[] } & InputHTMLAttributes<HTMLInputElement>;

const Input = ({ error = null, errorMessages = [], ...props }: InputProps) => {
    return (
        <div>
            <input {...props} />
            {error != null && <p className="mt-2 text-red-600 text-sm font-medium">{errorMessages[error]}</p>}
        </div>
    )
}

const Password = ({ error = null, errorMessages = [], ...props }: Omit<InputProps, 'type'>) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <div className="flex">
                <input type={showPassword ? 'text' : 'password'} {...props} />

                <span className="flex justify-around items-center relative">
                    <a href="#" className="absolute right-0 w-6 mx-2 text-gray-400" onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}>
                        <FontAwesomeIcon className="w-full" icon={showPassword ? faEye : faEyeSlash} />
                    </a>
                </span>
            </div>
            {error != null && <p className="mt-2 text-red-600 text-sm font-medium">{errorMessages[error]}</p>}
        </div>
    )
};

const Login = ({ changeToRegister }: { changeToRegister: () => void }) => {
    const { setShowLoginModal, login } = useUserContext();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({
        username: null,
        password: null
    });

    const validateForm = (formdata: FormData) => {
        var hasError = false;
        const setError = (props: object) => {
            setErrors((errors) => ({ ...errors, ...props }));
            hasError = true;
        }

        const username = formdata.get("username")!.toString();
        const password = formdata.get("password")!.toString();

        if (username.length == 0) setError({ username: UsernameErrors.Empty });
        if (password.length == 0) setError({ password: PasswordErrors.Empty });

        if (hasError) throw new Error("Couldn't validate form.");
        return { username, password };
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);

        setErrors({
            username: null,
            password: null
        });

        try {
            const formdata = new FormData(event.currentTarget)

            const payload = validateForm(formdata);

            const params = new URLSearchParams(payload);
            const response = await fetch('/api/users/login/?' + params)
                .then(res => res.json());

            switch (response.status as LoginStatus) {
                case LoginStatus.SUCCESS:
                    login(response.user, false);
                    setShowLoginModal(false);
                    break;
                case LoginStatus.USERNAME_INVALID:
                    setErrors((errors) => ({ ...errors, username: UsernameErrors.Invalid }));
                    break;
                case LoginStatus.PASSWORD_INVALID:
                    setErrors((errors) => ({ ...errors, password: PasswordErrors.Invalid }));
                    break;
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1 className="font-bold font-serif text-center text-4xl mb-8">Welcome Back!</h1>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <Input placeholder="Username" error={errors.username} errorMessages={UsernameErrorStrings} autoComplete="off" className={textInputClasses} type="text" name="username" key="loginUsername" />
                <Password placeholder="Password" error={errors.password} errorMessages={PasswordErrorStrings} autoComplete="off" className={passwordInputClasses} name="password" key="loginPassword" />

                <button disabled={loading} className={buttonClasses + " " + loginButtonClasses}>
                    {loading ? (<>
                        <FontAwesomeIcon className="animate-spin" icon={faSpinner} />   Logging in...
                    </>) : "Login"}
                </button>

                <h1 className="text-opacity-60 font-semibold text-black text-center">Don't have an account? <a className="hover:underline text-opacity-100 text-black cursor-pointer" onClick={changeToRegister}>Sign Up!</a></h1>
            </form>
        </>
    )
}

const Register = ({ changeToLogin }: { changeToLogin: () => void }) => {
    const { setShowLoginModal, login } = useUserContext();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>({
        username: null,
        fullname: null,
        email: null,
        password: null
    });

    const validateForm = (formdata: FormData) => {
        var hasError = false;
        const setError = (props: object) => {
            setErrors((errors) => ({ ...errors, ...props }));
            hasError = true;
        }

        const username = formdata.get("username")!.toString();
        const fullname = formdata.get("fullname")!.toString();
        const email = formdata.get("email")!.toString();
        const password = formdata.get("password")!.toString();

        if (username.length == 0) setError({ username: UsernameErrors.Empty });
        if (fullname.length == 0) setError({ fullname: FullnameErrors.Empty });
        if (email.length == 0) setError({ email: EmailErrors.Empty });
        if (password.length < 8) setError({ password: PasswordErrors.TooShort });

        const emailRegex = /\S+@ch\.(?:\S+\.|)amrita\.edu/;

        if (!emailRegex.test(email)) setError({ email: EmailErrors.StudentEmail });

        if (hasError) throw new Error("Couldn't validate form.");

        return { username, fullname, email, password };
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true);

        setErrors({
            username: null,
            fullname: null,
            email: null,
            password: null
        });

        try {
            const formdata = new FormData(event.currentTarget)

            const payload = validateForm(formdata);

            const response = await fetch('/api/users/register/', {
                method: 'POST',
                body: JSON.stringify(payload)
            })
                .then(res => res.json());

            switch (response.status as RegisterStatus) {
                case RegisterStatus.SUCCESS:
                    login(response.user, false);
                    setShowLoginModal(false);
                    break;
                case RegisterStatus.USERNAME_EXISTS:
                    setErrors((errors) => ({ ...errors, username: UsernameErrors.AlreadyExists }));
                    break;
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="font-bold font-serif text-center text-4xl mb-8">Register</h1>

            <form onSubmit={onSubmit} className="flex flex-col gap-5">
                <Input placeholder="Username" error={errors.username} errorMessages={UsernameErrorStrings} autoComplete="off" className={textInputClasses} type="text" name="username" key="registerUsername" />
                <Input placeholder="Name" error={errors.fullname} errorMessages={FullnameErrorStrings} autoComplete="off" className={textInputClasses} type="text" name="fullname" key="registerFullname" />
                <Input placeholder="Email" error={errors.email} errorMessages={EmailErrorStrings} autoComplete="off" className={textInputClasses} type="email" name="email" key="registerEmail" />
                <Password placeholder="Password" error={errors.password} errorMessages={PasswordErrorStrings} autoComplete="off" className={passwordInputClasses} name="password" key="registerPassword" />

                <button disabled={loading} className={buttonClasses + " " + registerButtonClasses}>{loading ? (
                    <>
                        <FontAwesomeIcon className="animate-spin" icon={faSpinner} />   Registering...
                    </>) : "Register"}
                </button>
                <h1 className="text-opacity-60 font-semibold text-black text-center">Already have an account? <a className="hover:underline text-opacity-100 text-black cursor-pointer" onClick={changeToLogin}>Login!</a></h1>
            </form>
        </>
    )
}

export default function LoginWrapper({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { showLoginModal, setShowLoginModal } = useUserContext();
    const [register, setRegister] = useState(false);

    return (
        <>
            <Modal isModalOpen={showLoginModal} closeModal={() => setShowLoginModal(false)} parentStyles="grid place-content-center" overlayStyles="bg-black/[0.6] backdrop-blur-sm">
                <motion.div className={`bg-gradient-to-b rounded-xl shadow-lg ${(register ? "from-lime-400 to-green-400" : "from-cyan-400 to-blue-400")}`}
                    variants={PopupAnimationVariants} initial="hidden" animate="visible" exit="exit" transition={{ ease: 'easeInOut' }}
                >
                    <div className="m-2 bg-white rounded-lg">
                        <div className="p-12">
                            {(register ? <Register changeToLogin={() => setRegister(false)} /> : <Login changeToRegister={() => setRegister(true)} />)}
                        </div>
                    </div>
                </motion.div>
            </Modal>
            {children}
        </>
    )
}