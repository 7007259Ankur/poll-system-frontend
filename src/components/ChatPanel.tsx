import { useState } from "react";

const dummyMessages = [
  { id: 1, user: "User 1", text: "Hey There, how can I help?" },
  { id: 2, user: "You", text: "Nothing bro, just chill!" },
];

const participants = [
  "Rahul Arora",
  "Pushpender Ratula",
  "Rijul Zubair",
  "Nadeem N",
  "Ashwin Sharma",
];

export default function ChatPanel({ isTeacher = false }: { isTeacher?: boolean }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"chat" | "participants">("chat");

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
      >
        💬
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-xl border flex flex-col">
          {/* Header */}
          <div className="flex border-b">
            <button
              onClick={() => setTab("chat")}
              className={`flex-1 py-3 text-sm font-medium ${
                tab === "chat"
                  ? "border-b-2 border-primary text-primary"
                  : "text-mutedText"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setTab("participants")}
              className={`flex-1 py-3 text-sm font-medium ${
                tab === "participants"
                  ? "border-b-2 border-primary text-primary"
                  : "text-mutedText"
              }`}
            >
              Participants
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {tab === "chat" &&
              dummyMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`text-sm max-w-[80%] px-3 py-2 rounded-lg ${
                    msg.user === "You"
                      ? "bg-primary text-white ml-auto"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  <p className="font-medium text-xs mb-1">{msg.user}</p>
                  {msg.text}
                </div>
              ))}

            {tab === "participants" &&
              participants.map((name) => (
                <div
                  key={name}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{name}</span>
                  {isTeacher && (
                    <button className="text-primary text-xs font-medium">
                      Kick out
                    </button>
                  )}
                </div>
              ))}
          </div>

          {/* Input (Chat only) */}
          {tab === "chat" && (
            <div className="border-t p-2">
              <input
                placeholder="Type a message..."
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="absolute -top-3 -right-3 bg-white border rounded-full w-6 h-6 text-xs shadow"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
