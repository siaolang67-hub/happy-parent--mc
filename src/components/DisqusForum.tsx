import React, { useEffect, useState } from 'react';
import { MessageSquare, Send, ThumbsUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface ForumComment {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  topic: string;
  content: string;
  likes: number;
  liked?: boolean;
}

const initialForumComments: ForumComment[] = [
  {
    id: 'fc_1',
    author: 'Serene Tan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    timeAgo: '2 hours ago',
    topic: 'Robotics & AI',
    content: 'My 11yo just finished 4 sessions at CodeKids Robotics Academy using credits. Dr. Alvin was super patient with Python fundamentals!',
    likes: 8,
  },
  {
    id: 'fc_2',
    author: 'Marcus Wong',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    timeAgo: '5 hours ago',
    topic: 'Gymnastics',
    content: 'Can anyone recommend Apex Athletics for a beginner 6-year-old? Looking to build agility and core strength without high competition pressure.',
    likes: 5,
  },
  {
    id: 'fc_3',
    author: 'Rachel Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timeAgo: '1 day ago',
    topic: 'Speech & Drama',
    content: 'Act1 Stage Arts transformed my shy 8yo daughter. She used to freeze up during school presentations and now volunteers eagerly!',
    likes: 12,
  },
];

export const DisqusForum: React.FC = () => {
  const [comments, setComments] = useState<ForumComment[]>(initialForumComments);
  const [newComment, setNewComment] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('General');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [disqusLoaded, setDisqusLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if ((window as any).DISQUS) {
          (window as any).DISQUS.reset({
            reload: true,
            config: function (this: any) {
              this.page.url = window.location.href;
              this.page.identifier = 'happy-parents-landing-forum';
            },
          });
          setDisqusLoaded(true);
        } else {
          const d = document;
          const s = d.createElement('script');
          s.src = 'https://agent-ai.disqus.com/embed.js';
          s.setAttribute('data-timestamp', (+new Date()).toString());
          s.async = true;
          s.onload = () => setDisqusLoaded(true);
          s.onerror = () => {
            // Gracefully ignore external Disqus load errors in sandboxed environments
            setDisqusLoaded(false);
          };
          (d.head || d.body).appendChild(s);
        }
      }
    } catch {
      // Prevent any unhandled script exceptions from bubbling
      setDisqusLoaded(false);
    }
  }, []);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item: ForumComment = {
      id: `fc_${Date.now()}`,
      author: 'You (Parent)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      timeAgo: 'Just now',
      topic: selectedTopic,
      content: newComment.trim(),
      likes: 0,
    };

    setComments([item, ...comments]);
    setNewComment('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleToggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const liked = !c.liked;
        return {
          ...c,
          liked,
          likes: liked ? c.likes + 1 : c.likes - 1,
        };
      })
    );
  };

  return (
    <section className="bg-white rounded-xl p-5 sm:p-6 border border-[#c3c5d9]/30 shadow-xs space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c3c5d9]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0042c8]" />
            <h3 className="text-lg font-extrabold text-[#191c1e] tracking-tight">Parent Discussion & Reviews Forum</h3>
          </div>
          <p className="text-xs text-[#434656] mt-0.5">
            Connect with fellow parents to ask questions, share class experiences, and recommend top academies.
          </p>
        </div>
        <span className="text-[11px] font-bold bg-[#e4e7ff] text-[#0042c8] px-3 py-1 rounded-full self-start sm:self-center">
          {comments.length} Parent Posts
        </span>
      </div>

      {/* Post a Question / Review Form */}
      <form onSubmit={handleAddComment} className="bg-[#f8f9fb] p-4 rounded-xl border border-[#c3c5d9]/40 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-[#191c1e]">Share a question or class review:</label>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#434656] font-medium">Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs font-semibold bg-white border border-[#c3c5d9]/60 rounded-md px-2 py-1 outline-hidden text-[#191c1e]"
            >
              <option value="General">General Inquiry</option>
              <option value="Robotics & AI">Robotics & AI</option>
              <option value="Gymnastics & Sports">Gymnastics & Sports</option>
              <option value="Speech & Drama">Speech & Drama</option>
              <option value="Pottery & Art">Pottery & Art</option>
              <option value="Creative Writing">Creative Writing</option>
            </select>
          </div>
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask for recommendations, compare academies, or share your child's learning journey..."
          rows={3}
          className="w-full text-xs p-3 bg-white border border-[#c3c5d9]/40 rounded-lg focus:ring-2 focus:ring-[#0042c8] outline-hidden resize-none placeholder:text-[#747789]"
        />

        <div className="flex items-center justify-between">
          {isSubmitted ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Posted successfully to community!
            </span>
          ) : (
            <span className="text-[11px] text-[#747789]">Parent community guidelines apply</span>
          )}

          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-[#0042c8] text-white text-xs font-bold rounded-lg hover:bg-[#003ab2] disabled:opacity-50 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            Post Comment
          </button>
        </div>
      </form>

      {/* Community Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 bg-[#f8f9fb] rounded-xl border border-[#c3c5d9]/30 space-y-2 hover:border-[#0042c8]/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full object-cover border border-[#c3c5d9]/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#191c1e]">{comment.author}</h4>
                  <span className="text-[10px] text-[#747789]">{comment.timeAgo}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-[#e4e7ff] text-[#0042c8] px-2 py-0.5 rounded-md">
                {comment.topic}
              </span>
            </div>

            <p className="text-xs text-[#434656] leading-relaxed pl-10.5">{comment.content}</p>

            <div className="flex justify-end pl-10.5 pt-1">
              <button
                type="button"
                onClick={() => handleToggleLike(comment.id)}
                className={`text-[11px] flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                  comment.liked
                    ? 'bg-[#0042c8] text-white font-bold'
                    : 'bg-white text-[#434656] hover:bg-[#e4e7ff] border border-[#c3c5d9]/40'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{comment.likes} {comment.likes === 1 ? 'Like' : 'Likes'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Disqus Thread placeholder */}
      <div id="disqus_thread" className={disqusLoaded ? 'mt-6 pt-6 border-t border-[#c3c5d9]/30' : 'hidden'}></div>
    </section>
  );
};

