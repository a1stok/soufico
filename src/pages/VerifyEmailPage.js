import React, { useEffect, useState } from "react";
import { auth } from "../core/config/firebase";
import { applyActionCode } from "firebase/auth";
import { useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const actionCode = searchParams.get("oobCode");
    const mode = searchParams.get("mode");

    if (mode === "verifyEmail" && actionCode) {
      applyActionCode(auth, actionCode)
        .then(() => {
          setMessage("Email verified successfully!");
        })
        .catch((error) => {
          setMessage(error.message);
        });
    }
  }, [searchParams]);

  return (
    <div className="verify-email-page">
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmailPage;
