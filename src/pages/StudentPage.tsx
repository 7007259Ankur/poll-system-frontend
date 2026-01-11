import { useState } from "react";
import StudentName from "./Student/StudentName";
import StudentWaiting from "./Student/StudentWaiting";
import StudentPoll from "./Student/StudentPoll";
import { useStudentPoll } from "../hooks/useStudentPoll";

export default function StudentPage() {
  // 1. STATE: We need the name to connect to the socket
  const [studentName, setStudentName] = useState("");

  // 2. HOOK: Pass the name to the hook (it returns 'submitVote', not 'vote')
 const { poll, submitVote } = useStudentPoll(studentName);

  // 3. LOGIC: Which screen to show?

  // Case A: User hasn't entered name yet
  if (!studentName) {
    return <StudentName onSubmit={setStudentName} />;
  }

  // Case B: Connected, but no active poll from teacher
  if (!poll) {
    return <StudentWaiting />;
  }

  // Case C: Active Poll (or Ended Poll result)
  return (
    <StudentPoll
      poll={poll}
      onVote={submitVote}
      isSubmitting={false}
    />
  );
}