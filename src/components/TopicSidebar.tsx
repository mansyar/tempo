import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { toast } from 'sonner';
import {
  ListPlus,
  History,
  Clock,
  CheckCircle2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useState } from 'react';

interface TopicSidebarProps {
  roomId: Id<'rooms'>;
  facilitatorId: string;
  identityId: string;
  onOpenBatchAdd: () => void;
}

export function TopicSidebar({
  roomId,
  facilitatorId,
  identityId,
  onOpenBatchAdd,
}: TopicSidebarProps) {
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<Id<'topics'> | null>(
    null
  );
  const [editingTitle, setEditingTitle] = useState('');

  const topics = useQuery(api.topics.listByRoom, { roomId });
  const isFacilitator = facilitatorId === identityId;

  const addTopic = useMutation(api.topics.add);
  const removeTopic = useMutation(api.topics.remove);
  const reorderTopic = useMutation(api.topics.reorder);
  const updateTopic = useMutation(api.topics.update);

  const pendingTopics =
    topics
      ?.filter((t) => t.status === 'pending' || t.status === 'active')
      .sort((a, b) => a.order - b.order) || [];
  const completedTopics =
    topics
      ?.filter((t) => t.status === 'completed')
      .sort((a, b) => b.order - a.order) || [];

  const visiblePending = isExpanded ? pendingTopics : pendingTopics.slice(0, 3);
  const hasMorePending = pendingTopics.length > 3;

  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) return;
    try {
      await addTopic({
        roomId,
        identityId,
        title: newTopicTitle.trim(),
      });
      setNewTopicTitle('');
      toast.success('Topic added!');
    } catch {
      toast.error('Failed to add topic');
    }
  };

  const handleRemoveTopic = async (topicId: Id<'topics'>) => {
    try {
      await removeTopic({ topicId, identityId });
      toast.success('Topic removed');
    } catch {
      toast.error('Failed to remove topic');
    }
  };

  const handleReorder = async (
    topicId: Id<'topics'>,
    currentOrder: number,
    direction: 'up' | 'down'
  ) => {
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    try {
      await reorderTopic({ topicId, identityId, newOrder });
    } catch {
      toast.error('Failed to reorder topic');
    }
  };

  const startEditing = (topicId: Id<'topics'>, title: string) => {
    if (!isFacilitator) return;
    setEditingTopicId(topicId);
    setEditingTitle(title);
  };

  const handleUpdateTopic = async () => {
    if (!editingTopicId) return;
    const trimmedTitle = editingTitle.trim();
    const originalTopic = topics?.find((t) => t._id === editingTopicId);

    if (trimmedTitle && trimmedTitle !== originalTopic?.title) {
      try {
        await updateTopic({
          topicId: editingTopicId,
          identityId,
          title: trimmedTitle,
        });
        toast.success('Topic updated');
      } catch {
        toast.error('Failed to update topic');
      }
    }
    setEditingTopicId(null);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)] z-10">
        <div className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-[var(--text-secondary)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">
            Topic Queue
          </h2>
        </div>
        {isFacilitator && (
          <button
            onClick={onOpenBatchAdd}
            className="p-1.5 rounded-sm bg-[var(--bg-tertiary)] hover:bg-[var(--accent)] text-[var(--text-secondary)] hover:text-white transition-all"
            aria-label="Batch Add"
            title="Batch Add"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 text-left">
        {/* Add Topic Input (Facilitator Only) */}
        {isFacilitator && (
          <section>
            <div className="relative">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                placeholder="Add a topic..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-primary)]"
              />
              <button
                onClick={handleAddTopic}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors"
                aria-label="Submit Topic"
              >
                <ListPlus className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* Pending Topics */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Pending
            </h3>
          </div>
          <div className="space-y-2">
            {pendingTopics.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] italic py-2">
                No topics in queue
              </p>
            ) : (
              <>
                {visiblePending.map((topic, _index) => (
                  <div
                    key={topic._id}
                    className={`p-3 rounded-md border flex items-center gap-3 group transition-all ${
                      topic.status === 'active'
                        ? 'border-[var(--accent)] bg-[var(--bg-primary)] ring-1 ring-[var(--accent)]/20 shadow-sm'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)]'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        topic.status === 'active'
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {topic.order}
                    </span>

                    {editingTopicId === topic._id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={handleUpdateTopic}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateTopic();
                          if (e.key === 'Escape') setEditingTopicId(null);
                        }}
                        className="text-sm flex-1 bg-[var(--bg-secondary)] border border-[var(--accent)] rounded px-1 py-0.5 outline-none text-[var(--text-primary)]"
                      />
                    ) : (
                      <span
                        onClick={() => startEditing(topic._id, topic.title)}
                        className={`text-sm flex-1 break-words py-0.5 ${
                          topic.status === 'active'
                            ? 'text-[var(--text-primary)] font-medium'
                            : 'text-[var(--text-secondary)]'
                        } ${isFacilitator ? 'cursor-pointer hover:text-[var(--text-primary)]' : ''}`}
                      >
                        {topic.title}
                      </span>
                    )}

                    {isFacilitator && topic.status !== 'active' && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-start">
                        <button
                          onClick={() =>
                            handleReorder(topic._id, topic.order, 'up')
                          }
                          disabled={topic.order === 1}
                          className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                          aria-label="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleReorder(topic._id, topic.order, 'down')
                          }
                          disabled={topic.order === pendingTopics.length}
                          className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] disabled:opacity-30"
                          aria-label="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveTopic(topic._id)}
                          className="p-1 text-[var(--text-tertiary)] hover:text-[var(--danger)]"
                          aria-label="Remove Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {topic.status === 'active' && (
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shrink-0" />
                    )}
                  </div>
                ))}

                {hasMorePending && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-2 text-xs font-bold text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors flex items-center justify-center gap-1 border border-dashed border-[var(--border-subtle)] rounded-md mt-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> See all (
                        {pendingTopics.length})
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </section>

        {/* History */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-[var(--text-tertiary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              History
            </h3>
          </div>
          <div className="space-y-2">
            {completedTopics.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] italic py-2">
                Empty history
              </p>
            ) : (
              completedTopics
                .sort((a, b) => b.order - a.order)
                .map((topic) => (
                  <div
                    key={topic._id}
                    className="p-3 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]/30 opacity-70 flex items-center gap-3 transition-opacity hover:opacity-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                    <span className="text-sm text-[var(--text-secondary)] flex-1 break-words py-0.5">
                      {topic.title}
                    </span>
                    {topic.finalEstimate && (
                      <span className="text-sm font-mono font-bold text-[var(--accent)] shrink-0 bg-[var(--bg-primary)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">
                        {topic.finalEstimate}
                      </span>
                    )}
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
