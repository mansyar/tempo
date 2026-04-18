import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
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
  const topics = useQuery(api.topics.listByRoom, { roomId });
  const isFacilitator = facilitatorId === identityId;

  const addTopic = useMutation(api.topics.add);
  const removeTopic = useMutation(api.topics.remove);
  const reorderTopic = useMutation(api.topics.reorder);

  const pendingTopics =
    topics?.filter((t) => t.status === 'pending' || t.status === 'active') ||
    [];
  const completedTopics = topics?.filter((t) => t.status === 'completed') || [];

  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) return;
    try {
      await addTopic({
        roomId,
        identityId,
        title: newTopicTitle.trim(),
      });
      setNewTopicTitle('');
    } catch (err) {
      console.error('Failed to add topic:', err);
    }
  };

  const handleRemoveTopic = async (topicId: Id<'topics'>) => {
    try {
      await removeTopic({ topicId, identityId });
    } catch (err) {
      console.error('Failed to remove topic:', err);
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
    } catch (err) {
      console.error('Failed to reorder topic:', err);
    }
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-left">
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
              pendingTopics
                .sort((a, b) => a.order - b.order)
                .map((topic, _index) => (
                  <div
                    key={topic._id}
                    className={`p-3 rounded-md border flex items-center gap-3 group transition-all ${
                      topic.status === 'active'
                        ? 'border-[var(--accent)] bg-[var(--bg-tertiary)] shadow-[var(--shadow-sm)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)]'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        topic.status === 'active'
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {topic.order}
                    </span>
                    <span
                      className={`text-sm flex-1 break-words py-0.5 ${
                        topic.status === 'active'
                          ? 'text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {topic.title}
                    </span>

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
                ))
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
                    className="p-3 rounded-md border border-transparent bg-[var(--bg-primary)] opacity-80 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                    <span className="text-sm text-[var(--text-secondary)] flex-1 break-words py-0.5">
                      {topic.title}
                    </span>
                    {topic.finalEstimate && (
                      <span className="text-sm font-mono font-bold text-[var(--accent)] shrink-0">
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
