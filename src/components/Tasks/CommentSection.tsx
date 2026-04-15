"use client"
import { useState, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Comment, CommentUser } from "@/types/task";

export default function CommentSection({ taskId }: { taskId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<CommentUser>({ name: "User", initials: "U" });

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("user_name") || "User";
    const initials = nameFromStorage.split(" ").map(n => n[0]).join("").toUpperCase();
    setCurrentUser({ name: nameFromStorage, initials } as CommentUser);
    
    setComments([{ 
      id: '1', 
      user: { name: 'System', initials: 'SY' }, 
      text: `Session active since ${new Date().toLocaleTimeString()}`,
      time: new Date().toLocaleTimeString()
    }]);
  }, [taskId]);

  const postComment = () => {
    if (!newComment.trim()) return;
    setIsSending(true);

    setTimeout(() => {
      const entry: Comment = {
        id: Date.now().toString(),
        user: currentUser,
        text: newComment.trim(),
        time: new Date().toLocaleTimeString()
      };

      setComments(prev => [...prev, entry]);//add comments tio the list
      setNewComment("");
      setIsSending(false);
    }, 400);
  };

  return (
    <section className="space-y-4 pt-6">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Feed</p>
      
      <div className="space-y-3">
        {comments.map(c => (
          <div key={c.id} className="flex gap-2">
            <div className="bg-slate-900 w-6 h-6 rounded-lg flex items-center justify-center text-white text-[8px] font-black shrink-0">
              {c.user.initials}
            </div>
            <div className="flex-1">
              <div className="bg-slate-50/50 p-2.5 rounded-xl rounded-tl-none border border-slate-100">
                <p className="text-[11px] text-slate-600 font-medium">{c.text}</p>
              </div>
              <p className="text-[7px] font-bold text-slate-300 uppercase mt-1 ml-1">{c.time}</p>
            </div>
          </div>
        ))}
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
          className="absolute bottom-2 right-2 bg-slate-900 text-white p-1.5 rounded-lg hover:bg-black transition-all"
        >
          {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        </button>
      </div>
    </section>
  );
}