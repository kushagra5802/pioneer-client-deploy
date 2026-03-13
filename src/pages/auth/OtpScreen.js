import React, { useState } from "react";
import { toast } from "react-toastify";
import useAxiosInstance from "../../lib/useAxiosInstance";
import ButtonLoader from "../../components/Loader/ButtonLoader";

const OtpScreen = ({
  payload,
  verifyUrl,
  resendUrl,
  onSuccess,
  onBack,
}) => {
  const axiosInstance = useAxiosInstance();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /* =======================
     OTP Handlers
  ======================= */

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  /* =======================
     Verify OTP
  ======================= */

  const handleVerifyOtp = async e => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setOtpError("");

    try {
      const response = await axiosInstance.post(verifyUrl, {
        ...payload,
        otp: otpValue,
      });

      toast.success("Login successful");
      onSuccess(response.data);
    } catch (error) {
      setOtpError(
        error?.response?.data?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================
     Resend OTP
  ======================= */

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError("");

    try {
      await axiosInstance.post(resendUrl, payload);
      toast.success("OTP resent successfully");
    } catch (error) {
      setOtpError(
        error?.response?.data?.message ||
          "Unable to resend OTP"
      );
    } finally {
      setResendLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */

  return (
    <form onSubmit={handleVerifyOtp}>
      <p className="text-center text-gray-600 mb-4">
        Enter 4-digit OTP
      </p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-4 mb-4">
        {[0, 1, 2, 3].map(index => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={e =>
              handleOtpChange(index, e.target.value)
            }
            onKeyDown={e => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-xl font-bold border rounded-xl focus:outline-none focus:border-sky-900"
          />
        ))}
      </div>

      {/* Error */}
      {otpError && (
        <p className="text-center text-red-500 text-sm mb-3">
          {otpError}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-between text-sm mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-500 hover:text-sky-900"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={resendLoading}
          className="text-gray-500 hover:text-sky-900"
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-[#0f172a] text-white rounded-xl font-semibold"
      >
        {isLoading ? <ButtonLoader /> : "VERIFY OTP"}
      </button>
    </form>
  );
};

export default OtpScreen;
