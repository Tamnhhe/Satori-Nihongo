import axios from 'axios';
import { ILesson, IFlashcard } from './lesson-content-editor';

const apiUrl = 'api/lessons';
const enhancedApiUrl = 'api/enhanced/lessons';

export interface ILessonService {
  createLesson: (lesson: ILesson) => Promise<ILesson>;
  updateLesson: (id: number, lesson: ILesson) => Promise<ILesson>;
  getLesson: (id: number) => Promise<ILesson>;
  deleteLesson: (id: number) => Promise<void>;
  uploadMedia: (lessonId: number, file: File, type: 'video' | 'slide' | 'attachment') => Promise<string>;
  removeMedia: (lessonId: number, mediaType: 'video' | 'slide') => Promise<void>;
  getLessonsByCourse: (courseId: number) => Promise<ILesson[]>;
}

class LessonContentService implements ILessonService {
  async createLesson(lesson: ILesson): Promise<ILesson> {
    const response = await axios.post(`${enhancedApiUrl}`, lesson);
    return response.data;
  }

  async updateLesson(id: number, lesson: ILesson): Promise<ILesson> {
    const response = await axios.put(`${enhancedApiUrl}/${id}`, lesson);
    return response.data;
  }

  async getLesson(id: number): Promise<ILesson> {
    const response = await axios.get(`${apiUrl}/${id}`);
    return response.data;
  }

  async deleteLesson(id: number): Promise<void> {
    await axios.delete(`${enhancedApiUrl}/${id}`);
  }

  async uploadMedia(lessonId: number, file: File, type: 'video' | 'slide' | 'attachment'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await axios.post(`${enhancedApiUrl}/${lessonId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url || response.data.fileUrl;
  }

  async removeMedia(lessonId: number, mediaType: 'video' | 'slide'): Promise<void> {
    await axios.delete(`${enhancedApiUrl}/${lessonId}/media/${mediaType}`);
  }

  async getLessonsByCourse(courseId: number): Promise<ILesson[]> {
    const response = await axios.get(`${enhancedApiUrl}/course/${courseId}`);
    return response.data;
  }

  // Flashcard specific methods
  async addFlashcard(lessonId: number, flashcard: Omit<IFlashcard, 'id'>): Promise<IFlashcard> {
    const response = await axios.post(`${enhancedApiUrl}/${lessonId}/flashcards`, flashcard);
    return response.data;
  }

  async updateFlashcard(lessonId: number, flashcardId: number, flashcard: IFlashcard): Promise<IFlashcard> {
    const response = await axios.put(`${enhancedApiUrl}/${lessonId}/flashcards/${flashcardId}`, flashcard);
    return response.data;
  }

  async deleteFlashcard(lessonId: number, flashcardId: number): Promise<void> {
    await axios.delete(`${enhancedApiUrl}/${lessonId}/flashcards/${flashcardId}`);
  }

  async reorderFlashcards(lessonId: number, flashcardIds: number[]): Promise<void> {
    await axios.put(`${enhancedApiUrl}/${lessonId}/flashcards/reorder`, { flashcardIds });
  }

  // File attachment methods
  async addFileAttachment(lessonId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${enhancedApiUrl}/${lessonId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async removeFileAttachment(lessonId: number, fileId: number): Promise<void> {
    await axios.delete(`${enhancedApiUrl}/${lessonId}/attachments/${fileId}`);
  }

  // Validation methods
  validateLesson(lesson: ILesson): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!lesson.title?.trim()) {
      errors.push('Title is required');
    }

    if (!lesson.content?.trim()) {
      errors.push('Content is required');
    }

    if (lesson.title && lesson.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }

    // Validate flashcards
    if (lesson.flashcards) {
      lesson.flashcards.forEach((flashcard, index) => {
        if (!flashcard.term?.trim()) {
          errors.push(`Flashcard ${index + 1}: Term is required`);
        }
        if (!flashcard.definition?.trim()) {
          errors.push(`Flashcard ${index + 1}: Definition is required`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Utility methods
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex >= 0 ? filename.slice(lastDotIndex + 1) : '';
  }

  isVideoFile(filename: string): boolean {
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return videoExtensions.includes(extension);
  }

  isSlideFile(filename: string): boolean {
    const slideExtensions = ['pdf', 'ppt', 'pptx', 'odp'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return slideExtensions.includes(extension);
  }

  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return imageExtensions.includes(extension);
  }

  // Content processing methods
  extractTextFromHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  getContentWordCount(content: string): number {
    const text = this.extractTextFromHtml(content);
    return text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
  }

  estimateReadingTime(content: string): number {
    const wordCount = this.getContentWordCount(content);
    const wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Search and filter methods
  searchLessons(lessons: ILesson[], query: string): ILesson[] {
    if (!query.trim()) return lessons;

    const searchTerm = query.toLowerCase();
    return lessons.filter(
      lesson =>
        lesson.title.toLowerCase().includes(searchTerm) ||
        this.extractTextFromHtml(lesson.content).toLowerCase().includes(searchTerm) ||
        lesson.flashcards?.some(
          flashcard => flashcard.term.toLowerCase().includes(searchTerm) || flashcard.definition.toLowerCase().includes(searchTerm),
        ),
    );
  }

  sortLessons(lessons: ILesson[], sortBy: 'title' | 'created' | 'modified'): ILesson[] {
    return [...lessons].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          // Assuming there's a createdDate field
          return new Date((a as any).createdDate).getTime() - new Date((b as any).createdDate).getTime();
        case 'modified':
          // Assuming there's a modifiedDate field
          return new Date((b as any).modifiedDate).getTime() - new Date((a as any).modifiedDate).getTime();
        default:
          return 0;
      }
    });
  }
}

export const lessonContentService = new LessonContentService();
export default lessonContentService;
