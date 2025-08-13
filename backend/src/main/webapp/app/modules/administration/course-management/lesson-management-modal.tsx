import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Spinner } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import LessonContentEditor, { ILesson } from './lesson-content-editor';
import lessonContentService from './lesson-content.service';

export interface ILessonManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson?: ILesson | null;
  courseId: number;
  onSave?: (lesson: ILesson) => void;
  readOnly?: boolean;
}

const LessonManagementModal: React.FC<ILessonManagementModalProps> = ({ isOpen, onClose, lesson, courseId, onSave, readOnly = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<ILesson>({
    title: '',
    content: '',
    videoUrl: '',
    slideUrl: '',
    flashcards: [],
    fileAttachments: [],
    course: { id: courseId },
  });

  useEffect(() => {
    if (lesson) {
      setCurrentLesson(lesson);
    } else {
      setCurrentLesson({
        title: '',
        content: '',
        videoUrl: '',
        slideUrl: '',
        flashcards: [],
        fileAttachments: [],
        course: { id: courseId },
      });
    }
    setError(null);
  }, [lesson, courseId]);

  const handleSave = async (updatedLesson: ILesson) => {
    setLoading(true);
    setError(null);

    try {
      // Validate the lesson
      const validation = lessonContentService.validateLesson(updatedLesson);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      let savedLesson: ILesson;

      if (updatedLesson.id) {
        // Update existing lesson
        savedLesson = await lessonContentService.updateLesson(updatedLesson.id, updatedLesson);
      } else {
        // Create new lesson
        savedLesson = await lessonContentService.createLesson(updatedLesson);
      }

      if (onSave) {
        onSave(savedLesson);
      }

      onClose();
    } catch (err: any) {
      console.error('Error saving lesson:', err);
      setError(err.response?.data?.message || 'Failed to save lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (file: File, type: 'video' | 'slide' | 'attachment'): Promise<string> => {
    try {
      if (currentLesson.id) {
        // Upload to existing lesson
        return await lessonContentService.uploadMedia(currentLesson.id, file, type);
      } else {
        // For new lessons, we'll need to create a temporary upload or handle differently
        // For now, we'll create a local URL and handle the actual upload on save
        return URL.createObjectURL(file);
      }
    } catch (uploadError: any) {
      console.error('Error uploading media:', uploadError);
      throw new Error(uploadError.response?.data?.message || 'Failed to upload media');
    }
  };

  const modalTitle = lesson?.id ? (readOnly ? 'View Lesson' : 'Edit Lesson') : 'Create New Lesson';

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="xl" className="lesson-management-modal" backdrop="static" keyboard={false}>
      <ModalHeader toggle={onClose}>
        <Translate contentKey={`lesson.${lesson?.id ? (readOnly ? 'view' : 'edit') : 'create'}.title`}>{modalTitle}</Translate>
      </ModalHeader>

      <ModalBody style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        {error && (
          <Alert color="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <LessonContentEditor
          lesson={currentLesson}
          onSave={handleSave}
          onMediaUpload={handleMediaUpload}
          loading={loading}
          readOnly={readOnly}
        />
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={loading}>
          <FontAwesomeIcon icon={faTimes} className="me-1" />
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>

        {!readOnly && (
          <Button color="primary" onClick={() => handleSave(currentLesson)} disabled={loading}>
            {loading && <Spinner size="sm" className="me-1" />}
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default LessonManagementModal;
