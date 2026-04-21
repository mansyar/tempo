import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
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
  Download,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import {
  generateMarkdown,
  generateSummary,
  generateCSV,
} from '../../utils/exporter';

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
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<Id<'topics'> | null>(
    null
  );
  const [editingTitle, setEditingTitle] = useState('');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const room = useQuery(api.rooms.getBySlug, {
    slug: window.location.pathname.split('/').pop() || '',
  });
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

  const visiblePending = isPendingExpanded
    ? pendingTopics
    : pendingTopics.slice(0, 3);
  const hasMorePending = pendingTopics.length > 3;

  const visibleHistory = isHistoryExpanded
    ? completedTopics
    : completedTopics.slice(0, 3);
  const hasMoreHistory = completedTopics.length > 3;

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

  const handleExport = (format: 'markdown' | 'summary' | 'csv') => {
    if (!completedTopics.length) {
      toast.error('No completed topics to export');
      return;
    }

    const roomName = room?.slug || 'Session';
    let content = '';
    let fileName = `${roomName}-export`;
    let type = 'text/plain';

    if (format === 'markdown') {
      content = generateMarkdown(roomName, completedTopics);
      fileName += '.md';
      type = 'text/markdown';
    } else if (format === 'summary') {
      content = generateSummary(roomName, completedTopics);
      fileName += '.txt';
    } else if (format === 'csv') {
      content = generateCSV(completedTopics);
      fileName += '.csv';
      type = 'text/csv';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    setIsExportMenuOpen(false);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b-4 border-black flex items-center justify-between bg-retro-yellow z-10">
        <div className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-black" />
          <h2 className="font-black uppercase text-black tracking-tight">
            Topic Queue
          </h2>
        </div>
        {isFacilitator && (
          <button
            onClick={onOpenBatchAdd}
            className="p-1.5 brutal-border bg-white hover:bg-retro-pink transition-all brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sm"
            aria-label="Batch Add"
            title="Batch Add"
          >
            <Layers className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-3 text-left bg-grid ${!isPendingExpanded && !isHistoryExpanded ? 'no-scrollbar' : ''}`}>
        {/* Add Topic Input (Facilitator Only) */}
        {isFacilitator && (
          <section>
            <div className="relative">
              <input
                type="text"
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
                placeholder="ADD A TOPIC..."
                className="w-full bg-white brutal-border py-1.5 pl-3 pr-10 text-xs font-black uppercase focus:outline-none focus:bg-retro-yellow transition-colors brutal-shadow"
              />
              <button
                onClick={handleAddTopic}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-black hover:text-retro-pink transition-colors"
                aria-label="Submit Topic"
              >
                <ListPlus className="w-5 h-5" />
              </button>
            </div>
          </section>
        )}

        {/* Pending Topics */}
        <section>
          <div className="flex items-center gap-2 mb-1.5 bg-black text-white px-2 py-0.5 brutal-border w-fit">
            <Clock className="w-3.5 h-3.5" />
            <h3 className="text-[8px] font-black uppercase tracking-widest">
              Pending
            </h3>
          </div>
          <div className="space-y-2">
            {pendingTopics.length === 0 ? (
              <p className="text-xs font-bold uppercase opacity-60 italic py-1">
                No topics in queue
              </p>
            ) : (
              <>
                {visiblePending.map((topic, _index) => (
                  <div
                    key={topic._id}
                    className={`p-1.5 brutal-border flex items-center gap-2 group transition-all brutal-shadow ${
                      topic.status === 'active'
                        ? 'bg-retro-green translate-x-0.5 translate-y-0.5 shadow-none'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 brutal-border shrink-0 ${
                        topic.status === 'active'
                          ? 'bg-black text-white'
                          : 'bg-retro-yellow text-black'
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
                        className="text-xs font-black uppercase flex-1 bg-white brutal-border px-1.5 py-0.5 outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => startEditing(topic._id, topic.title)}
                        className={`text-xs font-black uppercase flex-1 break-words py-0.5 ${
                          topic.status === 'active'
                            ? 'text-black'
                            : 'text-gray-800'
                        } ${isFacilitator ? 'cursor-pointer hover:underline decoration-2' : ''}`}
                      >
                        {topic.title}
                      </span>
                    )}

                    {isFacilitator && topic.status !== 'active' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-start">
                        <button
                          onClick={() =>
                            handleReorder(topic._id, topic.order, 'up')
                          }
                          disabled={topic.order === 1}
                          className="p-1 brutal-border bg-white hover:bg-retro-blue disabled:opacity-30"
                          aria-label="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleReorder(topic._id, topic.order, 'down')
                          }
                          disabled={topic.order === pendingTopics.length}
                          className="p-1 brutal-border bg-white hover:bg-retro-blue disabled:opacity-30"
                          aria-label="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveTopic(topic._id)}
                          className="p-1 brutal-border bg-white hover:bg-retro-pink"
                          aria-label="Remove Topic"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {topic.status === 'active' && (
                      <div className="w-3 h-3 brutal-border bg-black animate-ping shrink-0" />
                    )}
                  </div>
                ))}

                {hasMorePending && (
                  <button
                    onClick={() => setIsPendingExpanded(!isPendingExpanded)}
                    className="w-full py-2 text-[10px] font-black uppercase bg-white brutal-border border-dashed hover:bg-gray-50 transition-all flex items-center justify-center gap-1 mt-2"
                  >
                    {isPendingExpanded ? (
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
          <div className="flex items-center justify-between mb-1.5 bg-black text-white px-2 py-0.5 brutal-border">
            <div className="flex items-center gap-2">
              <History className="w-3 h-3" />
              <h3 className="text-[8px] font-black uppercase tracking-widest">
                History
              </h3>
            </div>
            {isFacilitator && completedTopics.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="p-1 brutal-border bg-white text-black hover:bg-retro-pink transition-all"
                  title="Export Session"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {isExportMenuOpen && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white brutal-border brutal-shadow z-[60] overflow-hidden">
                    <div className="p-2 border-b-4 border-black bg-retro-yellow">
                      <p className="text-[10px] font-black uppercase tracking-widest text-black">
                        Export Format
                      </p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => handleExport('markdown')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black uppercase text-black hover:bg-retro-blue transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Markdown
                      </button>
                      <button
                        onClick={() => handleExport('summary')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black uppercase text-black hover:bg-retro-pink transition-colors"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        Summary
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-black uppercase text-black hover:bg-retro-green transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        CSV
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {completedTopics.length === 0 ? (
              <p className="text-xs font-bold uppercase opacity-60 italic py-1">
                Empty history
              </p>
            ) : (
              <>
                {visibleHistory.map((topic) => (
                  <div
                    key={topic._id}
                    className="p-1.5 brutal-border bg-white flex items-center gap-2 transition-all brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3 text-black shrink-0" />
                    <span className="text-xs font-black uppercase text-black flex-1 break-words py-0.5">
                      {topic.title}
                    </span>
                    {topic.finalEstimate && (
                      <span className="text-[10px] font-black text-white bg-black px-1.5 py-0.5 brutal-border shrink-0">
                        {topic.finalEstimate}
                      </span>
                    )}
                  </div>
                ))}

                {hasMoreHistory && (
                  <button
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="w-full py-2 text-[10px] font-black uppercase bg-white brutal-border border-dashed hover:bg-gray-50 transition-all flex items-center justify-center gap-1 mt-2"
                  >
                    {isHistoryExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> See all (
                        {completedTopics.length})
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
