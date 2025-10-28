import { GalleryVerticalEnd } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import botImage from "../assets/botImg.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from 'axios'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
export function SignupForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
   const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatusMsg("Sending OTP to your email...");

  try {
    // send OTP request via axios
    const res = await axios.post(
      "http://localhost:5000/api/otp/sentOtp",
      formData,
      { headers: { "Content-Type": "application/json" } }
    );

    // handle success
    if (res.status === 200) {
      setStatusMsg("OTP has been sent to your email!");
      setTimeout(() => navigate("/verifyOtp"), 1000);
    } else {
      setStatusMsg(res.data?.message || "Signup failed!");
    }
  } catch (err) {
    console.error("Error:", err);
    setStatusMsg(
      err.response?.data?.message || " Server error. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-20 items-center justify-center rounded-md">
                <img src={botImage} alt="bot" className="w-15 h-15" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to AI verse.</h1>
            <FieldDescription>
              Already have an account? <Link to="/login">Sign in</Link>
            </FieldDescription>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder=""
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder=""
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Field>

            <Field>
               <Button
          type="submit"
          disabled={loading}
          
        >
           Create Account
        </Button>
            </Field>
            {statusMsg && (
        <p className="mt-4 text-sm text-gray-700 animate-pulse">{statusMsg}</p>
      )}
          </form>

          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
            <Button variant="outline" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
