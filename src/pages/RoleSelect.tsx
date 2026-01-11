import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "student" | "teacher";

export default function RoleSelect() {
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role === "student") navigate("/student");
    if (role === "teacher") navigate("/teacher");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl text-center px-6">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primaryLight text-primary">
          Intervue Poll
        </div>

        <h1 className="text-3xl font-semibold mb-2">
          Welcome to the <b>Live Polling System</b>
        </h1>

        <p className="text-mutedText mb-8">
          Please select your role
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            onClick={() => setRole("student")}
            className={`border p-4 rounded-xl cursor-pointer ${
              role === "student" && "border-primary"
            }`}
          >
            I’m a Student
          </div>

          <div
            onClick={() => setRole("teacher")}
            className={`border p-4 rounded-xl cursor-pointer ${
              role === "teacher" && "border-primary"
            }`}
          >
            I’m a Teacher
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!role}
          className="bg-primary text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
