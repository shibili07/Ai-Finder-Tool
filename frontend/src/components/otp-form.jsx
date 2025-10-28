import { useState } from "react"
import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function OTPForm({ className, ...props }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("Verifying OTP...");
    const email = localStorage.getItem("pendingEmail")
    try {
      const res = await axios.post(
        "http://localhost:5000/api/otp/verifyOtp",
        { email,otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200) {
        setStatusMsg("OTP verified successfully!");
        localStorage.removeItem("pendingEmail");
        localStorage.setItem("token", res.data.token);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setStatusMsg(res.data?.message || "Invalid OTP!");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setStatusMsg(
        err.response?.data?.message || "Verification failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form  onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to your email address
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              id="otp"
          maxLength={6}
          required
          value={otp}
          onChange={setOtp}
          containerClassName="gap-4"
              
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code? <a href="#">Resend</a>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </Button>
          </Field>
        </FieldGroup>
         {statusMsg && (
        <p
          className={`text-sm text-center ${
            statusMsg.includes("successfully") ? "text-green-600" : "text-red-500"
          } animate-pulse`}
        >
          {statusMsg}
        </p>
      )}
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
