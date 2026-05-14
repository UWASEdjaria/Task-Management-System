"use client";

import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Comment, CommentUser } from "@/types/task";
import { API_ENDPOINTS } from "@/lib/constants";

export default function CommentSection({ taskId }: { taskId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<CommentUser>({ name: "User", initials: "U" });

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !taskId) return;

    const fetchData = async () => {
      try {
        const [userRes, commentRes] = await Promise.all([
          fetch(`${API_ENDPOINTS.AUTH}/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_ENDPOINTS.COMMENTS}/${taskId}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        // Guard: Check if userRes is actually JSON
        if (userRes.ok && userRes.headers.get("content-type")?.includes("application/json")) {
          const userData = await userRes.json();
          const user = userData.data || userData.user || userData;
          const userName = user.fullName || user.name || user.email || "Anonymous";
          
          setCurrentUser({
            name: userName,
            initials: getInitials(userName)
          });
        } else {
          console.error("Auth /me request failed:", userRes.status, userRes.statusText);
          // Keep default fallback
          setCurrentUser({
            name: "User",
            initials: "U"
          });
        }

        // Guard: Check if commentRes is actually JSON
        if (commentRes.ok && commentRes.headers.get("content-type")?.includes("application/json")) {
          const commentData = await commentRes.json();

          if (commentData.success && Array.isArray(commentData.data)) {

            const formatted: Comment[] = commentData.data.map(
              (c: Comment & { content: string; createdAt: string }) => ({
                ...c,
                text: c.content,
                time: new Date(c.createdAt).toLocaleTimeString(),
                user: {
                  initials: getInitials(c.user?.fullName || "User")
                }
              })
            );
            setComments(formatted);
          }
        } else {
          console.error("API returned non-JSON response. Check your API routes.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        // Set fallback user even on error
        setCurrentUser({
          name: "User",
          initials: "U"
        });
      }
    };

    fetchData();
  }, [taskId]);

  const postComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    setIsSending(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.COMMENTS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment.trim(), taskId }),
      });

      if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
        const result = await response.json();
        const saved = result.data;

        setComments((prev) => [
          ...prev,
          {
            ...saved,
            text: saved.content,
            time: "Just now",
            user: {initials: currentUser?.initials || "U" },
          },
        ]);
        setNewComment("");
      } else {
        console.error("Failed to post comment:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Post failed:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="space-y-4 pt-6">
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="bg-slate-900 w-6 h-6 rounded-lg flex items-center justify-center text-white text-[8px] font-black shrink-0">
                {c.user?.initials || "U"}
              </div>
              <div className="flex-1">
                <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-600 font-medium">{c.text}</p>
                </div>
                <p className="text-[7px] font-bold text-slate-300 uppercase mt-1 ml-1">{c.time}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[10px] text-slate-400 text-center py-2">No activity yet</p>
        )}
      </div>

      <div className="relative pt-2">
        <textarea
          aria-label="Add comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Reply..."
          className="w-full bg-slate-50 border-none rounded-xl p-3 text-[11px] font-medium outline-none focus:ring-1 ring-slate-200 resize-none min-h-[60px]"
        />
        <button
          onClick={postComment}
          disabled={isSending || !newComment.trim()}
          className="absolute bottom-2 right-2 bg-slate-900 text-white p-1.5 rounded-lg hover:bg-black transition-all disabled:opacity-50"
        >
          {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        </button>
      </div>
    </section>
  );
}