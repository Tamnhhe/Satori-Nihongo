import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faSearch,
  faPlus,
  faEye,
  faEdit,
  faTrash,
  faVideo,
  faFileText,
  faGamepad,
  faClock,
  faUsers,
  faStar,
  faTh,
  faList,
  faSort,
} from '@fortawesome/free-solid-svg-icons';
import { Button, LoadingSpinner, EmptyState } from '../../shared/components/ui';
import { mockLessons } from '../../shared/data/mockData';

interface LessonLibraryProps {
  className?: string;
}

type ViewMode = 'grid' | 'list';
type LessonStatus = 'all' | 'published' | 'draft' | 'archived';
type LessonType = 'all' | 'video' | 'interactive' | 'quiz' | 'text';

const LessonLibrary: React.FC<LessonLibraryProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LessonStatus>('all');
  const [typeFilter, setTypeFilter] = useState<LessonType>('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate extended mock lessons
      const extendedLessons = [
        ...mockLessons,
        {
          id: 3,
          title: 'Basic Greetings and Introductions',
          courseId: 1,
          duration: '20 min',
          type: 'video',
          status: 'published',
          completionRate: 94,
          averageScore: 4.7,
          description: 'Learn essential Japanese greetings and how to introduce yourself',
          thumbnail: '/images/lessons/greetings.jpg',
          enrolledStudents: 245,
          createdDate: '2024-07-15',
          lastUpdated: '2024-08-01',
        },
        {
          id: 4,
          title: 'Katakana Writing Practice',
          courseId: 1,
          duration: '35 min',
          type: 'interactive',
          status: 'draft',
          completionRate: 0,
          averageScore: 0,
          description: 'Interactive exercises for mastering katakana characters',
          thumbnail: '/images/lessons/katakana.jpg',
          enrolledStudents: 0,
          createdDate: '2024-08-10',
          lastUpdated: '2024-08-10',
        },
        {
          id: 5,
          title: 'Business Email Writing',
          courseId: 2,
          duration: '45 min',
          type: 'text',
          status: 'published',
          completionRate: 87,
          averageScore: 4.5,
          description: 'Professional email templates and etiquette in Japanese business',
          thumbnail: '/images/lessons/business-email.jpg',
          enrolledStudents: 78,
          createdDate: '2024-06-20',
          lastUpdated: '2024-07-28',
        },
        {
          id: 6,
          title: 'Vocabulary Quiz: Family Members',
          courseId: 1,
          duration: '15 min',
          type: 'quiz',
          status: 'published',
          completionRate: 91,
          averageScore: 4.3,
          description: 'Test your knowledge of family member vocabulary',
          thumbnail: '/images/lessons/family-quiz.jpg',
          enrolledStudents: 189,
          createdDate: '2024-07-05',
          lastUpdated: '2024-07-20',
        },
      ];

      setLessons(extendedLessons);
      setLoading(false);
    };

    loadLessons();
  }, []);

  const filteredAndSortedLessons = React.useMemo(() => {
    const filtered = lessons.filter(lesson => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
      const matchesType = typeFilter === 'all' || lesson.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'popularity':
          return b.enrolledStudents - a.enrolledStudents;
        case 'rating':
          return b.averageScore - a.averageScore;
        default:
          return 0;
      }
    });
  }, [lessons, searchQuery, statusFilter, typeFilter, sortBy]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return faVideo;
      case 'interactive':
        return faGamepad;
      case 'quiz':
        return faFileText;
      case 'text':
        return faBookOpen;
      default:
        return faBookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'interactive':
        return 'bg-purple-100 text-purple-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      case 'text':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Library</h1>
                <p className="text-gray-600">Manage and organize your teaching content</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'grid' ? 'bg-primary-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTh} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'list' ? 'bg-primary-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faList} />
                  </button>
                </div>

                <Button icon={faPlus} onClick={() => console.warn('Create new lesson')}>
                  Create Lesson
                </Button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{lessons.length}</div>
                <div className="text-sm text-gray-600">Total Lessons</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-800">{lessons.filter(l => l.status === 'published').length}</div>
                <div className="text-sm text-green-600">Published</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-lg font-semibold text-yellow-800">{lessons.filter(l => l.status === 'draft').length}</div>
                <div className="text-sm text-yellow-600">Drafts</div>
              </div>
              <div className="text-center p-3 bg-primary-50 rounded-lg">
                <div className="text-lg font-semibold text-primary-800">
                  {Math.round(lessons.reduce((acc, l) => acc + l.completionRate, 0) / lessons.length)}%
                </div>
                <div className="text-sm text-primary-600">Avg Completion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-soft">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search lessons by title or description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as LessonStatus)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as LessonType)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="video">Video</option>
                <option value="interactive">Interactive</option>
                <option value="quiz">Quiz</option>
                <option value="text">Text</option>
              </select>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSort} className="text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="title">Title</option>
                  <option value="date">Last Updated</option>
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons Content */}
        {filteredAndSortedLessons.length === 0 ? (
          <EmptyState
            icon={faBookOpen}
            title="No lessons found"
            description="Try adjusting your search or filter criteria, or create a new lesson to get started."
            action={{
              label: 'Create New Lesson',
              onClick: () => console.warn('Create new lesson'),
            }}
          />
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedLessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-250 group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250"
                        onError={e => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop`;
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lesson.type)}`}
                        >
                          <FontAwesomeIcon icon={getTypeIcon(lesson.type)} className="w-3 h-3 mr-1" />
                          {lesson.type}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}
                        >
                          {lesson.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1" />
                          {lesson.duration}
                        </div>
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                          {lesson.enrolledStudents}
                        </div>
                      </div>

                      {lesson.status === 'published' && (
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-gray-600">{lesson.averageScore}</span>
                          </div>
                          <div className="text-gray-600">{lesson.completionRate}% completion</div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div className="flex gap-1">
                          <button
                            className="p-2 text-gray-600 hover:text-primary-400 transition-colors"
                            onClick={() => console.warn('View lesson', lesson)}
                            aria-label="View lesson"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-primary-400 transition-colors"
                            onClick={() => console.warn('Edit lesson', lesson)}
                            aria-label="Edit lesson"
                          >
                            <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                            onClick={() => console.warn('Delete lesson', lesson)}
                            aria-label="Delete lesson"
                          >
                            <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(lesson.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-lg shadow-soft overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredAndSortedLessons.map(lesson => (
                    <div key={lesson.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 min-w-0">
                          <img
                            src={lesson.thumbnail}
                            alt={lesson.title}
                            className="w-16 h-16 rounded-lg object-cover bg-gray-200 mr-4 flex-shrink-0"
                            onError={e => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64&h=64&fit=crop`;
                            }}
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{lesson.title}</h3>
                            <p className="text-gray-600 mb-2 line-clamp-1">{lesson.description}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lesson.type)}`}
                              >
                                <FontAwesomeIcon icon={getTypeIcon(lesson.type)} className="w-3 h-3 mr-1" />
                                {lesson.type}
                              </span>
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1" />
                                {lesson.duration}
                              </div>
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                                {lesson.enrolledStudents} students
                              </div>
                              {lesson.status === 'published' && (
                                <div className="flex items-center">
                                  <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-1" />
                                  {lesson.averageScore} • {lesson.completionRate}% completion
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}
                          >
                            {lesson.status}
                          </span>

                          <span className="text-sm text-gray-500">{formatDate(lesson.lastUpdated)}</span>

                          <div className="flex gap-1">
                            <button
                              className="p-2 text-gray-600 hover:text-primary-400 transition-colors"
                              onClick={() => console.warn('View lesson', lesson)}
                              aria-label="View lesson"
                            >
                              <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-primary-400 transition-colors"
                              onClick={() => console.warn('Edit lesson', lesson)}
                              aria-label="Edit lesson"
                            >
                              <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                              onClick={() => console.warn('Delete lesson', lesson)}
                              aria-label="Delete lesson"
                            >
                              <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LessonLibrary;
