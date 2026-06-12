/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useRef, useEffect } from "react";
import { SearchIcon, SendIcon, PlusIcon, ArrowLeft } from "lucide-react";
import {
  useFileUploadWithMessageMutation,
  useGetMessagesQuery,
  useGetMyConversationListsQuery,
} from "@/redux/features/messages/messagesAPI";
import { WebSocketProvider, useSocket } from "@/provider/SocketProvider";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { clearConversation } from "@/redux/features/messages/conversationSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ── API shapes ────────────────────────────────────────────────────────────────

type ApiParticipant = {
  id: number;
  full_name: string;
  image: string | null;
  last_activity: string;
};

type ApiMessageFile = {
  id: number;
  file: string;
  file_name?: string;
  file_type?: string;
};

type ApiLastMessage = {
  id: number;
  text: string;
  files: ApiMessageFile[];
  status: string;
  sender_name: string;
  created_at: string;
  updated_at: string;
};

type ApiConversation = {
  id: number;
  participants: ApiParticipant[];
  last_message: ApiLastMessage | null;
};

type ApiMessageSender = {
  id: number;
  full_name: string;
  image: string | null;
  last_activity: string;
};

type ApiMessage = {
  id: number;
  text: string;
  files: ApiMessageFile[];
  status: string;
  sender: ApiMessageSender;
  created_at: string;
  updated_at: string;
};

type FilterTab = "unread" | "read" | "all";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getOtherParticipant(
  participants: ApiParticipant[],
  myId: number,
): ApiParticipant {
  return participants.find((p) => p.id !== myId) ?? participants[0];
}

function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/placeholder.svg";
  const base = (process.env.NEXT_PUBLIC_IMAGE_URL || "").replace(/\/$/, "");
  const filePath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${filePath}`;
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function ConversationSkeleton() {
  return (
    <div className='divide-y divide-border'>
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className='p-3 sm:p-4 flex items-start gap-3 animate-pulse'
        >
          <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted shrink-0' />
          <div className='flex-1 min-w-0 space-y-2'>
            <div className='flex items-center justify-between gap-2'>
              <div className='h-3.5 w-28 rounded bg-muted' />
              <div className='h-3 w-10 rounded bg-muted shrink-0' />
            </div>
            <div className='h-3 w-44 rounded bg-muted' />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesSkeleton() {
  const layout = [
    { sent: false, lines: 2, wide: false },
    { sent: true, lines: 1, wide: false },
    { sent: false, lines: 3, wide: true },
    { sent: true, lines: 2, wide: false },
    { sent: false, lines: 1, wide: false },
    { sent: true, lines: 3, wide: true },
    { sent: false, lines: 2, wide: false },
    { sent: true, lines: 1, wide: false },
  ];
  return (
    <div className='flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4'>
      {layout.map((item, i) => (
        <div
          key={i}
          className={`flex ${item.sent ? "justify-end" : "justify-start"} animate-pulse`}
        >
          <div
            className={`flex flex-col gap-1.5 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 ${
              item.wide ? "w-44 sm:w-56 md:w-64" : "w-28 sm:w-36 md:w-44"
            } ${
              item.sent
                ? "bg-blue-100 rounded-br-none"
                : "bg-muted rounded-bl-none border border-border"
            }`}
          >
            {Array.from({ length: item.lines }).map((_, li) => (
              <div
                key={li}
                className={`h-3 rounded ${
                  item.sent ? "bg-blue-200" : "bg-muted-foreground/20"
                } ${li === item.lines - 1 && item.lines > 1 ? "w-3/4" : "w-full"}`}
              />
            ))}
            <div
              className={`h-2.5 w-10 rounded mt-1 self-end ${
                item.sent ? "bg-blue-200" : "bg-muted-foreground/20"
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function MessagingComponent() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<ApiMessage[] | undefined>();
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter] = useState<FilterTab>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { socket, connect } = useSocket();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const myId: number = user?.id ?? 0;

  const [fileUploadWithMessageMutation, { isLoading: isUploadingWithMessage }] =
    useFileUploadWithMessageMutation();

  // ── Fetch conversations ──────────────────────────────────────────────────
  const { data: conversationsData, isFetching: conversationsFetching } =
    useGetMyConversationListsQuery({
      page: 1,
      limit: 100,
      search: searchQuery,
      message_status: activeFilter,
    });

  const conversations: ApiConversation[] =
    conversationsData?.data ?? conversationsData?.data?.results ?? [];

  // Auto-select first conversation on initial load
  useEffect(() => {
    if (conversations.length > 0 && selectedConversationId === null) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? null;

  const otherParticipant =
    selectedConversation && selectedConversation.participants.length > 0
      ? getOtherParticipant(selectedConversation.participants, myId)
      : null;

  // ── Fetch messages ───────────────────────────────────────────────────────
  const {
    data: messagesData,
    refetch: refetchMessages,
    isFetching: messagesFetching,
  } = useGetMessagesQuery(
    { conversationId: selectedConversationId, page: 1, page_size: 1000 },
    { skip: !selectedConversationId },
  );

  // Clear messages immediately on conversation switch
  useEffect(() => {
    setMessages(undefined);
  }, [selectedConversationId]);

  // Merge API messages with any WS-only optimistic messages
  useEffect(() => {
    const incoming: ApiMessage[] | undefined =
      messagesData?.data?.messages ?? messagesData?.data;
    if (!Array.isArray(incoming)) return;

    setMessages((prev) => {
      const merged = new Map<number, ApiMessage>();
      incoming.forEach((m) => merged.set(m.id, m));
      (prev ?? []).forEach((m) => {
        if (!merged.has(m.id)) merged.set(m.id, m);
      });
      return Array.from(merged.values()).sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    });
  }, [messagesData]);

  // Connect WebSocket when conversation changes
  useEffect(() => {
    if (!selectedConversationId) return;
    connect(selectedConversationId);
  }, [selectedConversationId, connect]);

  // WebSocket incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        const payload = raw?.data ?? raw?.message ?? raw;

        if (!payload?.id && !payload?.message_id) return;

        const incoming: ApiMessage = {
          id: payload.id ?? payload.message_id,
          text: payload.text ?? "",
          files: Array.isArray(payload.files) ? payload.files : [],
          status: payload.status ?? "sent",
          sender: {
            id: payload.sender?.id ?? payload.sender_id,
            full_name: payload.sender?.full_name ?? payload.sender_name ?? "",
            image: payload.sender?.image ?? null,
            last_activity: payload.sender?.last_activity ?? "",
          },
          created_at: payload.created_at,
          updated_at: payload.updated_at ?? payload.created_at,
        };

        if (!incoming.sender.id) return;

        setMessages((prev) => {
          if (!prev) return [incoming];
          const exists = prev.some((m) => m.id === incoming.id);
          if (exists) return prev;
          return [...prev, incoming].sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          );
        });
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectConversation = (conv: ApiConversation) => {
    setSelectedConversationId(conv.id);
  };

  const handleBack = () => {
    setSelectedConversationId(null);
    dispatch(clearConversation());
  };

  const handleSendMessage = async () => {
    const hasText = newMessage.trim().length > 0;
    const hasFiles = selectedFiles.length > 0;

    if (!hasText && !hasFiles) return;
    if (!selectedConversationId) return;

    if (hasFiles) {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("message", hasText ? newMessage : "");
        formData.append("files", file);

        try {
          const res = await fileUploadWithMessageMutation({
            conversationId: selectedConversationId,
            body: formData,
          }).unwrap();

          if (res?.status || res?.success) {
            refetchMessages();
            toast.success("Message sent successfully!");
          }
        } catch {
          toast.error("Failed to send file.");
        }
      }
      setSelectedFiles([]);
      setNewMessage("");
      return;
    }

    if (!socket) return;
    socket.send(
      JSON.stringify({
        message: newMessage,
        chat_id: selectedConversationId,
      }),
    );
    setNewMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (index: number) =>
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

  const isConversationSelected = !!selectedConversationId;

  // ── Message Input ────────────────────────────────────────────────────────

  const MessageInput = (
    <div className='border-t border-[#0074BE] bg-background p-3 sm:p-4 shrink-0 safe-area-bottom'>
      {selectedFiles.length > 0 && (
        <div className='flex flex-wrap gap-2 mb-3 max-h-28 overflow-y-auto'>
          {selectedFiles.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;
            return (
              <div
                key={index}
                className='relative group flex items-center gap-2 bg-muted rounded-lg p-2 pr-7 max-w-40'
              >
                {isImage && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className='h-9 w-9 rounded object-cover shrink-0'
                  />
                ) : (
                  <div className='h-9 w-9 rounded bg-blue-100 flex items-center justify-center shrink-0'>
                    <span className='text-xs text-blue-600 font-bold uppercase'>
                      {file.name.split(".").pop()}
                    </span>
                  </div>
                )}
                <p className='text-xs text-muted-foreground truncate'>
                  {file.name}
                </p>
                <button
                  onClick={() => removeFile(index)}
                  className='absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center hover:bg-red-600'
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className='flex items-center gap-1.5 sm:gap-2'>
        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          accept='image/*,.pdf,.doc,.docx,.txt'
          multiple
          onChange={handleFileChange}
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => fileInputRef.current?.click()}
          className='h-10 w-10 shrink-0'
        >
          <PlusIcon className='h-4 w-4 sm:h-5 sm:w-5' />
        </Button>
        <Input
          placeholder='Write your message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className='rounded-lg h-10 sm:h-11 text-sm sm:text-base'
        />
        <Button
          onClick={handleSendMessage}
          disabled={
            (!newMessage && selectedFiles.length === 0) ||
            !selectedConversationId ||
            isUploadingWithMessage
          }
          className='w-10 h-10 sm:w-11 sm:h-11 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg disabled:bg-[#2563EB] disabled:text-white disabled:cursor-not-allowed shrink-0'
          size='icon'
        >
          <SendIcon className='h-4 w-4 sm:h-5 sm:w-5' />
        </Button>
      </div>
    </div>
  );

  // ── Message Bubbles ──────────────────────────────────────────────────────

  const MessageList = (
    <div className='flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4'>
      {messages?.map((message) => {
        const isSent = message.sender.id === myId;
        const hasFiles =
          Array.isArray(message.files) && message.files.length > 0;

        return (
          <div
            key={message.id}
            className={`flex ${isSent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] md:max-w-sm lg:max-w-xs rounded-lg overflow-hidden ${
                isSent
                  ? "bg-[linear-gradient(to_right,#004A8F,#008290)] text-white rounded-br-none"
                  : "bg-background text-foreground border border-[#008290] rounded-bl-none"
              }`}
            >
              {/* File attachments */}
              {hasFiles &&
                message.files.map((fileObj, fi) => {
                  // fileObj is { id, file, file_name?, file_type? }
                  // AFTER
                  const fileUrl: string =
                    typeof fileObj === "string"
                      ? fileObj
                      : ((fileObj as ApiMessageFile).file ?? "");
                  const fileName: string =
                    typeof fileObj === "string"
                      ? (fileUrl.split("/").pop() ?? "")
                      : ((fileObj as ApiMessageFile).file_name ??
                        fileUrl.split("/").pop() ??
                        "");
                  const ext = fileUrl.split(".").pop()?.toLowerCase() ?? "";
                  const isImage = [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                  ].includes(ext);

                  // ✅ Use absolute URL directly; fall back to getImageUrl only for relative paths
                  const fullUrl =
                    fileUrl.startsWith("http://") ||
                    fileUrl.startsWith("https://")
                      ? fileUrl
                      : getImageUrl(fileUrl);

                  return isImage ? (
                    <a
                      key={fi}
                      href={fullUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img
                        src={fullUrl}
                        alt='attachment'
                        className='w-full max-w-xs object-cover rounded-t-lg'
                      />
                    </a>
                  ) : (
                    <a
                      key={fi}
                      href={fullUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`flex items-center gap-2 px-3 sm:px-4 py-3 ${
                        isSent ? "hover:bg-blue-700" : "hover:bg-muted"
                      } transition-colors`}
                    >
                      <div className='h-9 w-9 rounded bg-white/20 flex items-center justify-center shrink-0'>
                        <span className='text-xs font-bold uppercase'>
                          {ext}
                        </span>
                      </div>
                      <p className='text-xs truncate'>{fileName}</p>
                    </a>
                  );
                })}

              {/* Text */}
              {message.text && (
                <div className='px-3 sm:px-4 py-2'>
                  <p className='text-sm leading-relaxed'>{message.text}</p>
                </div>
              )}

              {/* Timestamp + status */}
              <div
                className={`px-2 pb-1.5 flex ${isSent ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`text-xs ${
                    isSent ? "text-blue-100" : "text-muted-foreground"
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isSent && (
                    <span className='ml-1'>
                      {message.status === "seen" ? "✓✓" : "✓"}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className='h-dvh sm:h-[85vh] md:h-[80vh] bg-background flex overflow-hidden'>
      {/* Sidebar */}
      <div
        className={`
          flex-col bg-background
          w-full md:w-72 lg:w-96 md:shrink-0 shadow-2xl pr-2
          ${isConversationSelected ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Search */}
        <div className='p-3 sm:p-4 border-b border-[#0074BE] shrink-0'>
          <div className='relative'>
            <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search messages...'
              className='pl-10 rounded-lg h-10 text-sm'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className='flex-1 overflow-y-auto'>
          {conversationsFetching ? (
            <ConversationSkeleton />
          ) : conversations.length > 0 ? (
            <div className='space-y-2 mt-2'>
              {conversations.map((conv) => {
                const other = getOtherParticipant(conv.participants, myId);
                const isActive = selectedConversationId === conv.id;
                const lastMsg = conv.last_message;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3 sm:p-4 cursor-pointer transition-colors rounded-sm border border-[#0074BE] ${
                      isActive
                        ? "bg-blue-50 border-l-4 border-l-blue-600"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    <div className='flex items-start gap-2.5 sm:gap-3'>
                      {/* Avatar */}
                      <div className='relative shrink-0'>
                        <img
                          src={getImageUrl(other.image)}
                          alt={other.full_name || "avatar"}
                          width={48}
                          height={48}
                          className='h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover'
                        />
                        <div className='absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 rounded-full border-2 border-background' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between gap-2'>
                          <h3 className='font-semibold text-foreground text-sm truncate'>
                            {other.full_name}
                          </h3>
                          {lastMsg && (
                            <span className='text-xs text-muted-foreground shrink-0'>
                              {new Date(lastMsg.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          )}
                        </div>

                        <p className='text-xs text-muted-foreground mt-0.5 truncate'>
                          {lastMsg
                            ? lastMsg.files.length > 0
                              ? "📎 File"
                              : lastMsg.text
                            : "No messages yet"}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {lastMsg?.status === "sent" && (
                        <div className='bg-[#2563EB] text-white text-xs font-semibold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shrink-0'>
                          •
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='flex items-center justify-center h-64 text-muted-foreground'>
              <p className='text-sm'>No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`
          flex-col flex-1 bg-muted/30 min-w-0
          ${isConversationSelected ? "flex" : "hidden md:flex"}
        `}
      >
        {isConversationSelected && selectedConversation ? (
          <>
            {/* Header */}
            <div className='border-b border-border bg-background px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 shrink-0'>
              <button
                onClick={handleBack}
                className='md:hidden text-blue-600 shrink-0 p-1 -ml-1'
                aria-label='Back to conversations'
              >
                <ArrowLeft className='h-5 w-5' />
              </button>

              {otherParticipant && (
                <>
                  <div className='relative shrink-0'>
                    <img
                      src={getImageUrl(otherParticipant.image)}
                      alt={otherParticipant.full_name || "avatar"}
                      width={40}
                      height={40}
                      className='h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover'
                    />
                    <div className='absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-background' />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <h2 className='font-semibold text-foreground truncate text-sm sm:text-base'>
                      {otherParticipant.full_name}
                    </h2>
                    <p className='text-xs text-muted-foreground'>Active now</p>
                  </div>
                </>
              )}
            </div>

            {messagesFetching ? <MessagesSkeleton /> : MessageList}
            {MessageInput}
          </>
        ) : (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            <p className='text-sm'>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagingPage() {
  return (
    <WebSocketProvider>
      <MessagingComponent />
    </WebSocketProvider>
  );
}

// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @next/next/no-img-element */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { SearchIcon, SendIcon, PlusIcon, ArrowLeft } from "lucide-react";
// import {
//   useFileUploadWithMessageMutation,
//   useGetMessagesQuery,
//   useGetMyConversationListsQuery,
// } from "@/redux/features/messages/messagesAPI";
// import { WebSocketProvider, useSocket } from "@/provider/SocketProvider";
// import { useAuth } from "@/hooks/useAuth";
// import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { clearConversation } from "@/redux/features/messages/conversationSlice";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// // ── API shapes ────────────────────────────────────────────────────────────────

// type ApiParticipant = {
//   id: number;
//   full_name: string;
//   image: string | null;
//   last_activity: string;
// };

// type ApiLastMessage = {
//   id: number;
//   text: string;
//   files: string[];
//   status: string;
//   sender_name: string;
//   created_at: string;
//   updated_at: string;
// };

// type ApiConversation = {
//   id: number;
//   participants: ApiParticipant[];
//   last_message: ApiLastMessage | null;
// };

// type ApiMessageSender = {
//   id: number;
//   full_name: string;
//   image: string | null;
//   last_activity: string;
// };

// type ApiMessage = {
//   id: number;
//   text: string;
//   files: string[];
//   status: string;
//   sender: ApiMessageSender;
//   created_at: string;
//   updated_at: string;
// };

// type FilterTab = "unread" | "read" | "all";

// // ── Helpers ───────────────────────────────────────────────────────────────────

// /**
//  * From a conversation's participants array, pick the first participant
//  * who is NOT the current user. Falls back to participants[0] if everyone
//  * in the list is the current user (e.g. self-conversation).
//  */
// function getOtherParticipant(
//   participants: ApiParticipant[],
//   myId: number,
// ): ApiParticipant {
//   return participants.find((p) => p.id !== myId) ?? participants[0];
// }

// function getImageUrl(path: string | null | undefined): string {
//   if (!path) return "/placeholder.svg";
//   const base = (process.env.NEXT_PUBLIC_IMAGE_URL || "").replace(/\/$/, "");
//   const filePath = path.startsWith("/") ? path : `/${path}`;
//   return `${base}${filePath}`;
// }

// // ── Skeletons ─────────────────────────────────────────────────────────────────

// function ConversationSkeleton() {
//   return (
//     <div className='divide-y divide-border'>
//       {Array.from({ length: 7 }).map((_, i) => (
//         <div
//           key={i}
//           className='p-3 sm:p-4 flex items-start gap-3 animate-pulse'
//         >
//           <div className='h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-muted shrink-0' />
//           <div className='flex-1 min-w-0 space-y-2'>
//             <div className='flex items-center justify-between gap-2'>
//               <div className='h-3.5 w-28 rounded bg-muted' />
//               <div className='h-3 w-10 rounded bg-muted shrink-0' />
//             </div>
//             <div className='h-3 w-44 rounded bg-muted' />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function MessagesSkeleton() {
//   const layout = [
//     { sent: false, lines: 2, wide: false },
//     { sent: true, lines: 1, wide: false },
//     { sent: false, lines: 3, wide: true },
//     { sent: true, lines: 2, wide: false },
//     { sent: false, lines: 1, wide: false },
//     { sent: true, lines: 3, wide: true },
//     { sent: false, lines: 2, wide: false },
//     { sent: true, lines: 1, wide: false },
//   ];
//   return (
//     <div className='flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4'>
//       {layout.map((item, i) => (
//         <div
//           key={i}
//           className={`flex ${item.sent ? "justify-end" : "justify-start"} animate-pulse`}
//         >
//           <div
//             className={`flex flex-col gap-1.5 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 ${
//               item.wide ? "w-44 sm:w-56 md:w-64" : "w-28 sm:w-36 md:w-44"
//             } ${
//               item.sent
//                 ? "bg-blue-100 rounded-br-none"
//                 : "bg-muted rounded-bl-none border border-border"
//             }`}
//           >
//             {Array.from({ length: item.lines }).map((_, li) => (
//               <div
//                 key={li}
//                 className={`h-3 rounded ${
//                   item.sent ? "bg-blue-200" : "bg-muted-foreground/20"
//                 } ${li === item.lines - 1 && item.lines > 1 ? "w-3/4" : "w-full"}`}
//               />
//             ))}
//             <div
//               className={`h-2.5 w-10 rounded mt-1 self-end ${
//                 item.sent ? "bg-blue-200" : "bg-muted-foreground/20"
//               }`}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ── Main component ────────────────────────────────────────────────────────────

// function MessagingComponent() {
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [selectedConversationId, setSelectedConversationId] = useState<
//     number | null
//   >(null);
//   const [messages, setMessages] = useState<ApiMessage[] | undefined>();
//   const [newMessage, setNewMessage] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const { socket, connect } = useSocket();
//   const { user } = useAuth();
//   const dispatch = useDispatch();

//   console.log({ user });

//   const myId: number = user?.id ?? 0;

//   const [fileUploadWithMessageMutation, { isLoading: isUploadingWithMessage }] =
//     useFileUploadWithMessageMutation();

//   // ── Fetch conversations ──────────────────────────────────────────────────
//   const { data: conversationsData, isFetching: conversationsFetching } =
//     useGetMyConversationListsQuery({
//       page: 1,
//       limit: 100,
//       search: searchQuery,
//       message_status: activeFilter,
//     });

//   const conversations: ApiConversation[] =
//     conversationsData?.data ?? conversationsData?.data?.results ?? [];

//   // Auto-select first conversation on initial load
//   useEffect(() => {
//     if (conversations.length > 0 && selectedConversationId === null) {
//       setSelectedConversationId(conversations[0].id);
//     }
//   }, [conversations, selectedConversationId]);

//   const selectedConversation =
//     conversations.find((c) => c.id === selectedConversationId) ?? null;

//   const otherParticipant =
//     selectedConversation && selectedConversation.participants.length > 0
//       ? getOtherParticipant(selectedConversation.participants, myId)
//       : null;

//   // ── Fetch messages ───────────────────────────────────────────────────────
//   const {
//     data: messagesData,
//     refetch: refetchMessages,
//     isFetching: messagesFetching,
//   } = useGetMessagesQuery(
//     { conversationId: selectedConversationId, page: 1, page_size: 1000 },
//     { skip: !selectedConversationId },
//   );

//   // Clear messages immediately on conversation switch
//   useEffect(() => {
//     setMessages(undefined);
//   }, [selectedConversationId]);

//   // Merge API messages (source of truth) with any WS-only messages not yet persisted
//   useEffect(() => {
//     const incoming: ApiMessage[] | undefined =
//       messagesData?.data?.messages ?? messagesData?.data;
//     if (!Array.isArray(incoming)) return;

//     setMessages((prev) => {
//       const merged = new Map<number, ApiMessage>();
//       incoming.forEach((m) => merged.set(m.id, m));
//       (prev ?? []).forEach((m) => {
//         if (!merged.has(m.id)) merged.set(m.id, m);
//       });
//       return Array.from(merged.values()).sort(
//         (a, b) =>
//           new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
//       );
//     });
//   }, [messagesData]);

//   // Connect WebSocket when conversation changes
//   useEffect(() => {
//     if (!selectedConversationId) return;
//     connect(selectedConversationId);
//   }, [selectedConversationId, connect]);

//   // WebSocket incoming messages
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const raw = JSON.parse(event.data);
//         const payload = raw?.data ?? raw?.message ?? raw;

//         // Normalise to ApiMessage shape
//         if (!payload?.id && !payload?.message_id) return;

//         const incoming: ApiMessage = {
//           id: payload.id ?? payload.message_id,
//           text: payload.text ?? "",
//           files: payload.files ?? [],
//           status: payload.status ?? "sent",
//           sender: {
//             id: payload.sender?.id ?? payload.sender_id,
//             full_name: payload.sender?.full_name ?? payload.sender_name ?? "",
//             image: payload.sender?.image ?? null,
//             last_activity: payload.sender?.last_activity ?? "",
//           },
//           created_at: payload.created_at,
//           updated_at: payload.updated_at ?? payload.created_at,
//         };

//         if (!incoming.sender.id) return;

//         setMessages((prev) => {
//           if (!prev) return [incoming];
//           const exists = prev.some((m) => m.id === incoming.id);
//           if (exists) return prev;
//           return [...prev, incoming].sort(
//             (a, b) =>
//               new Date(a.created_at).getTime() -
//               new Date(b.created_at).getTime(),
//           );
//         });
//       } catch (err) {
//         console.error("WS parse error:", err);
//       }
//     };

//     socket.addEventListener("message", handleMessage);
//     return () => socket.removeEventListener("message", handleMessage);
//   }, [socket]);

//   // Scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ── Handlers ─────────────────────────────────────────────────────────────

//   const handleSelectConversation = (conv: ApiConversation) => {
//     setSelectedConversationId(conv.id);
//     // dispatch(setConversation(conv));
//   };

//   const handleBack = () => {
//     setSelectedConversationId(null);
//     dispatch(clearConversation());
//   };

//   const handleSendMessage = async () => {
//     const hasText = newMessage.trim().length > 0;
//     const hasFiles = selectedFiles.length > 0;

//     if (!hasText && !hasFiles) return;
//     if (!selectedConversationId) return;

//     if (hasFiles) {
//       for (const file of selectedFiles) {
//         const isImage = file.type.startsWith("image/");
//         const formData = new FormData();
//         formData.append("message_type", isImage ? "image" : "file");
//         formData.append("text", hasText ? newMessage : "Here is the file");
//         formData.append("files", file);

//         const res = await fileUploadWithMessageMutation({
//           conversationId: selectedConversationId,
//           body: formData,
//         }).unwrap();

//         if (res?.status || res?.success) {
//           refetchMessages();
//           toast.success("Message sent successfully!");
//         }
//       }
//       setSelectedFiles([]);
//       setNewMessage("");
//       return;
//     }

//     if (!socket) return;
//     socket.send(
//       JSON.stringify({
//         message: newMessage,
//         chat_id: 6,
//       }),
//     );
//     setNewMessage("");
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length) setSelectedFiles((prev) => [...prev, ...files]);
//     e.target.value = "";
//   };

//   const removeFile = (index: number) =>
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

//   const isConversationSelected = !!selectedConversationId;

//   // ── Message Input ────────────────────────────────────────────────────────

//   const MessageInput = (
//     <div className='border-t border-[#0074BE] bg-background p-3 sm:p-4 shrink-0 safe-area-bottom'>
//       {selectedFiles.length > 0 && (
//         <div className='flex flex-wrap gap-2 mb-3 max-h-28 overflow-y-auto'>
//           {selectedFiles.map((file, index) => {
//             const isImage = file.type.startsWith("image/");
//             const previewUrl = isImage ? URL.createObjectURL(file) : null;
//             return (
//               <div
//                 key={index}
//                 className='relative group flex items-center gap-2 bg-muted rounded-lg p-2 pr-7 max-w-40'
//               >
//                 {isImage && previewUrl ? (
//                   <img
//                     src={previewUrl}
//                     alt={file.name}
//                     className='h-9 w-9 rounded object-cover shrink-0'
//                   />
//                 ) : (
//                   <div className='h-9 w-9 rounded bg-blue-100 flex items-center justify-center shrink-0'>
//                     <span className='text-xs text-blue-600 font-bold uppercase'>
//                       {file.name.split(".").pop()}
//                     </span>
//                   </div>
//                 )}
//                 <p className='text-xs text-muted-foreground truncate'>
//                   {file.name}
//                 </p>
//                 <button
//                   onClick={() => removeFile(index)}
//                   className='absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center hover:bg-red-600'
//                 >
//                   ×
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div className='flex items-center gap-1.5 sm:gap-2'>
//         <input
//           type='file'
//           ref={fileInputRef}
//           className='hidden'
//           accept='image/*,.pdf,.doc,.docx,.txt'
//           multiple
//           onChange={handleFileChange}
//         />
//         <Button
//           variant='ghost'
//           size='icon'
//           onClick={() => fileInputRef.current?.click()}
//           className='h-10 w-10 shrink-0'
//         >
//           <PlusIcon className='h-4 w-4 sm:h-5 sm:w-5' />
//         </Button>
//         <Input
//           placeholder='Write your message...'
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleSendMessage();
//             }
//           }}
//           className='rounded-lg h-10 sm:h-11 text-sm sm:text-base'
//         />
//         <Button
//           onClick={handleSendMessage}
//           disabled={
//             (!newMessage && selectedFiles.length === 0) ||
//             !selectedConversationId ||
//             isUploadingWithMessage
//           }
//           className='w-10 h-10 sm:w-11 sm:h-11 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg disabled:bg-[#2563EB] disabled:text-white disabled:cursor-not-allowed shrink-0'
//           size='icon'
//         >
//           <SendIcon className='h-4 w-4 sm:h-5 sm:w-5' />
//         </Button>
//       </div>
//     </div>
//   );

//   // ── Message Bubbles ──────────────────────────────────────────────────────

//   const MessageList = (
//     <div className='flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4'>
//       {messages?.map((message) => {
//         const isSent = message.sender.id === myId;
//         const hasFiles = message.files.length > 0;

//         console.log("isSent", isSent);
//         return (
//           <div
//             key={message.id}
//             className={`flex ${isSent ? "justify-end" : "justify-start"}`}
//           >
//             <div
//               className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] md:max-w-sm lg:max-w-xs rounded-lg overflow-hidden ${
//                 isSent
//                   ? "bg-[linear-gradient(to_right,#004A8F,#008290)] text-white rounded-br-none"
//                   : "bg-background text-foreground border border-[#008290] rounded-bl-none"
//               }`}
//             >
//               {/* File attachments */}
//               {hasFiles &&
//                 message.files.map((fileUrl, fi) => {
//                   const ext = fileUrl?.split(".").pop()?.toLowerCase() ?? "";
//                   const isImage = [
//                     "jpg",
//                     "jpeg",
//                     "png",
//                     "gif",
//                     "webp",
//                   ].includes(ext);
//                   const fullUrl = getImageUrl(fileUrl);

//                   return isImage ? (
//                     <a
//                       key={fi}
//                       href={fullUrl}
//                       target='_blank'
//                       rel='noopener noreferrer'
//                     >
//                       <img
//                         src={fullUrl}
//                         alt='attachment'
//                         className='w-full max-w-xs object-cover rounded-t-lg'
//                       />
//                     </a>
//                   ) : (
//                     <a
//                       key={fi}
//                       href={fullUrl}
//                       target='_blank'
//                       rel='noopener noreferrer'
//                       className={`flex items-center gap-2 px-3 sm:px-4 py-3 ${
//                         isSent ? "hover:bg-blue-700" : "hover:bg-muted"
//                       } transition-colors`}
//                     >
//                       <div className='h-9 w-9 rounded bg-white/20 flex items-center justify-center shrink-0'>
//                         <span className='text-xs font-bold uppercase'>
//                           {ext}
//                         </span>
//                       </div>
//                       <p className='text-xs truncate'>
//                         {fileUrl?.split("/").pop()}
//                       </p>
//                     </a>
//                   );
//                 })}

//               {/* Text */}
//               {message.text && (
//                 <div className='px-3 sm:px-4 py-2'>
//                   <p className='text-sm leading-relaxed'>{message.text}</p>
//                 </div>
//               )}

//               {/* Timestamp */}
//               <div
//                 className={`px-2 pb-1.5 flex ${isSent ? "justify-end" : "justify-start"}`}
//               >
//                 <p
//                   className={`text-xs ${
//                     isSent ? "text-blue-100" : "text-muted-foreground"
//                   }`}
//                 >
//                   {new Date(message.created_at).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                   {isSent && (
//                     <span className='ml-1'>
//                       {message.status === "seen" ? "✓✓" : "✓"}
//                     </span>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//       <div ref={messagesEndRef} />
//     </div>
//   );

//   // ── Render ───────────────────────────────────────────────────────────────

//   return (
//     <div className='h-dvh sm:h-[85vh] md:h-[80vh] bg-background flex overflow-hidden'>
//       {/* Sidebar */}
//       <div
//         className={`
//           flex-col bg-background
//           w-full md:w-72 lg:w-96 md:shrink-0 shadow-2xl pr-2
//           ${isConversationSelected ? "hidden md:flex" : "flex"}
//         `}
//       >
//         {/* Search */}
//         <div className='p-3 sm:p-4 border-b border-[#0074BE] shrink-0'>
//           <div className='relative'>
//             <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
//             <Input
//               placeholder='Search messages...'
//               className='pl-10 rounded-lg h-10 text-sm'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         {/* <div className='flex border-b border-border px-3 sm:px-4 shrink-0'>
//           {(["all", "unread", "read"] as const).map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveFilter(tab)}
//               className={`flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
//                 activeFilter === tab
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div> */}

//         {/* Conversations */}
//         <div className='flex-1 overflow-y-auto'>
//           {conversationsFetching ? (
//             <ConversationSkeleton />
//           ) : conversations.length > 0 ? (
//             <div className='space-y-2 mt-2'>
//               {conversations.map((conv) => {
//                 const other = getOtherParticipant(conv.participants, myId);
//                 const isActive = selectedConversationId === conv.id;
//                 const lastMsg = conv.last_message;

//                 return (
//                   <div
//                     key={conv.id}
//                     onClick={() => handleSelectConversation(conv)}
//                     className={`p-3 sm:p-4 cursor-pointer transition-colors rounded-sm border border-[#0074BE]  ${
//                       isActive
//                         ? "bg-blue-50 border-l-4 border-l-blue-600"
//                         : "bg-background hover:bg-muted"
//                     }`}
//                   >
//                     <div className='flex items-start gap-2.5 sm:gap-3'>
//                       {/* Avatar */}
//                       <div className='relative shrink-0'>
//                         <img
//                           src={getImageUrl(other.image)}
//                           alt={other.full_name || "avatar"}
//                           width={48}
//                           height={48}
//                           className='h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover'
//                         />
//                         <div className='absolute bottom-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-green-500 rounded-full border-2 border-background' />
//                       </div>

//                       <div className='flex-1 min-w-0'>
//                         <div className='flex items-center justify-between gap-2'>
//                           <h3 className='font-semibold text-foreground text-sm truncate'>
//                             {other.full_name}
//                           </h3>
//                           {lastMsg && (
//                             <span className='text-xs text-muted-foreground shrink-0'>
//                               {new Date(lastMsg.created_at).toLocaleTimeString(
//                                 [],
//                                 {
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 },
//                               )}
//                             </span>
//                           )}
//                         </div>

//                         <p className='text-xs text-muted-foreground mt-0.5 truncate'>
//                           {lastMsg
//                             ? lastMsg.files.length > 0
//                               ? "📎 File"
//                               : lastMsg.text
//                             : "No messages yet"}
//                         </p>
//                       </div>

//                       {/* Unread badge — based on status */}
//                       {lastMsg?.status === "sent" && (
//                         <div className='bg-[#2563EB] text-white text-xs font-semibold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shrink-0'>
//                           •
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className='flex items-center justify-center h-64 text-muted-foreground'>
//               <p className='text-sm'>No conversations found</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Chat Panel */}
//       <div
//         className={`
//           flex-col flex-1 bg-muted/30 min-w-0
//           ${isConversationSelected ? "flex" : "hidden md:flex"}
//         `}
//       >
//         {isConversationSelected && selectedConversation ? (
//           <>
//             {/* Header */}
//             <div className='border-b border-border bg-background px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 shrink-0'>
//               <button
//                 onClick={handleBack}
//                 className='md:hidden text-blue-600 shrink-0 p-1 -ml-1'
//                 aria-label='Back to conversations'
//               >
//                 <ArrowLeft className='h-5 w-5' />
//               </button>

//               {otherParticipant && (
//                 <>
//                   <div className='relative shrink-0'>
//                     <img
//                       src={getImageUrl(otherParticipant.image)}
//                       alt={otherParticipant.full_name || "avatar"}
//                       width={40}
//                       height={40}
//                       className='h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover'
//                     />
//                     <div className='absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-background' />
//                   </div>

//                   <div className='flex-1 min-w-0'>
//                     <h2 className='font-semibold text-foreground truncate text-sm sm:text-base'>
//                       {otherParticipant.full_name}
//                     </h2>
//                     <p className='text-xs text-muted-foreground'>Active now</p>
//                   </div>
//                 </>
//               )}
//             </div>

//             {messagesFetching ? <MessagesSkeleton /> : MessageList}
//             {MessageInput}
//           </>
//         ) : (
//           <div className='flex items-center justify-center h-full text-muted-foreground'>
//             <p className='text-sm'>Select a conversation to start messaging</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function MessagingPage() {
//   return (
//     <WebSocketProvider>
//       <MessagingComponent />
//     </WebSocketProvider>
//   );
// }
