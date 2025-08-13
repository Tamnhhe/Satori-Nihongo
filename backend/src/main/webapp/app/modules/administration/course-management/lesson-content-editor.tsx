import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, CardHeader, Form, FormGroup, Label, Input, Alert, Spinner } from 'reactstrap';
import { useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faPlus, faEdit, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
import { Translate, translate } from 'react-jhipster';

export interface IFlashcard {
  id?: number;
  term: string;
  definition: string;
  imageUrl?: string;
  hint?: string;
  position: number;
}

export interface ILesson {
  id?: number;
  title: string;
  content: string;
  videoUrl?: string;
  slideUrl?: string;
  flashcards?: IFlashcard[];
  fileAttachments?: any[];
  course?: any;
}

export interface ILessonContentEditorProps {
  lesson: ILesson;
  onSave: (lesson: ILesson) => Promise<void>;
  onMediaUpload: (file: File, type: 'video' | 'slide' | 'attachment') => Promise<string>;
  loading?: boolean;
  readOnly?: boolean;
}

// eslint-disable-next-line complexity
const LessonContentEditor: React.FC<ILessonContentEditorProps> = ({ lesson, onSave, onMediaUpload, loading = false, readOnly = false }) => {
  const [editedLesson, setEditedLesson] = useState<ILesson>(lesson);
  const [flashcards, setFlashcards] = useState<IFlashcard[]>(lesson.flashcards || []);
  const [editingFlashcard, setEditingFlashcard] = useState<number | null>(null);
  const [newFlashcard, setNewFlashcard] = useState<Partial<IFlashcard>>({});
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setEditedLesson(lesson);
    setFlashcards(lesson.flashcards || []);
  }, [lesson]);

  // Enhanced rich text editor configuration
  const quillModules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ align: [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        ['clean'],
      ],
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true,
    },
  };

  const quillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'check',
    'indent',
    'direction',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
    'formula',
  ];

  // Enhanced file upload handlers with validation
  const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => file.type.startsWith(type) || file.name.toLowerCase().endsWith(type.replace('*', '')));
  };

  const onVideoDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (readOnly) return;

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejectionReasons = rejectedFiles.map(({ errors: fileErrors }) => fileErrors.map((e: any) => e.message).join(', ')).join('; ');
        setErrors(prev => ({ ...prev, video: `File rejected: ${rejectionReasons}` }));
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validate file size (max 100MB for videos)
        if (!validateFileSize(file, 100)) {
          setErrors(prev => ({ ...prev, video: translate('lesson.upload.error.fileSize', { max: '100MB' }) }));
          return;
        }

        setUploadingFiles(prev => ({ ...prev, video: true }));
        setErrors(prev => ({ ...prev, video: '' }));

        try {
          const videoUrl = await onMediaUpload(file, 'video');
          setEditedLesson(prev => ({ ...prev, videoUrl }));
        } catch (error: any) {
          console.error('Video upload error:', error);
          setErrors(prev => ({
            ...prev,
            video: error.message || translate('lesson.upload.error'),
          }));
        } finally {
          setUploadingFiles(prev => ({ ...prev, video: false }));
        }
      }
    },
    [onMediaUpload, readOnly],
  );

  const onSlideDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (readOnly) return;

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejectionReasons = rejectedFiles.map(({ errors: fileErrors }) => fileErrors.map((e: any) => e.message).join(', ')).join('; ');
        setErrors(prev => ({ ...prev, slide: `File rejected: ${rejectionReasons}` }));
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validate file size (max 50MB for slides)
        if (!validateFileSize(file, 50)) {
          setErrors(prev => ({ ...prev, slide: translate('lesson.upload.error.fileSize', { max: '50MB' }) }));
          return;
        }

        setUploadingFiles(prev => ({ ...prev, slide: true }));
        setErrors(prev => ({ ...prev, slide: '' }));

        try {
          const slideUrl = await onMediaUpload(file, 'slide');
          setEditedLesson(prev => ({ ...prev, slideUrl }));
        } catch (error: any) {
          console.error('Slide upload error:', error);
          setErrors(prev => ({
            ...prev,
            slide: error.message || translate('lesson.upload.error'),
          }));
        } finally {
          setUploadingFiles(prev => ({ ...prev, slide: false }));
        }
      }
    },
    [onMediaUpload, readOnly],
  );

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
    isDragReject: isVideoDragReject,
  } = useDropzone({
    onDrop: onVideoDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/avi': ['.avi'],
      'video/quicktime': ['.mov'],
      'video/x-ms-wmv': ['.wmv'],
      'video/x-flv': ['.flv'],
      'video/webm': ['.webm'],
      'video/x-matroska': ['.mkv'],
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: readOnly,
    multiple: false,
  });

  const {
    getRootProps: getSlideRootProps,
    getInputProps: getSlideInputProps,
    isDragActive: isSlideDragActive,
    isDragReject: isSlideDragReject,
  } = useDropzone({
    onDrop: onSlideDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.oasis.opendocument.presentation': ['.odp'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: readOnly,
    multiple: false,
  });

  // Flashcard management with image support
  const addFlashcard = () => {
    if (newFlashcard.term && newFlashcard.definition) {
      const flashcard: IFlashcard = {
        term: newFlashcard.term,
        definition: newFlashcard.definition,
        hint: newFlashcard.hint,
        imageUrl: newFlashcard.imageUrl,
        position: flashcards.length,
      };
      setFlashcards(prev => [...prev, flashcard]);
      setNewFlashcard({});
    }
  };

  const handleFlashcardImageUpload = async (file: File): Promise<string> => {
    try {
      return await onMediaUpload(file, 'attachment');
    } catch (error: any) {
      console.error('Flashcard image upload error:', error);
      throw new Error(error.message || translate('lesson.upload.error'));
    }
  };

  const updateFlashcard = (index: number, updatedFlashcard: IFlashcard) => {
    setFlashcards(prev => prev.map((card, i) => (i === index ? updatedFlashcard : card)));
    setEditingFlashcard(null);
  };

  const deleteFlashcard = (index: number) => {
    setFlashcards(prev => prev.filter((_, i) => i !== index));
  };

  const moveFlashcard = (fromIndex: number, toIndex: number) => {
    setFlashcards(prev => {
      const newFlashcards = [...prev];
      const [removed] = newFlashcards.splice(fromIndex, 1);
      newFlashcards.splice(toIndex, 0, removed);
      return newFlashcards.map((card, index) => ({ ...card, position: index }));
    });
  };

  // Save handler
  const handleSave = async () => {
    const lessonToSave = {
      ...editedLesson,
      flashcards,
    };

    try {
      await onSave(lessonToSave);
    } catch (error) {
      setErrors(prev => ({ ...prev, save: translate('lesson.save.error') }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editedLesson.title?.trim()) {
      newErrors.title = translate('lesson.validation.title.required');
    }

    if (!editedLesson.content?.trim()) {
      newErrors.content = translate('lesson.validation.content.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="lesson-content-editor">
      <Card>
        <CardHeader>
          <h4>
            <Translate contentKey="lesson.editor.title">Lesson Content Editor</Translate>
          </h4>
        </CardHeader>
        <CardBody>
          {errors.save && <Alert color="danger">{errors.save}</Alert>}

          <Form>
            {/* Lesson Title */}
            <FormGroup>
              <Label for="lesson-title">
                <Translate contentKey="lesson.title">Title</Translate> *
              </Label>
              <Input
                type="text"
                id="lesson-title"
                value={editedLesson.title}
                onChange={e => setEditedLesson(prev => ({ ...prev, title: e.target.value }))}
                invalid={!!errors.title}
                disabled={readOnly}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </FormGroup>

            {/* Rich Text Content */}
            <FormGroup>
              <Label htmlFor="lesson-content-editor">
                <Translate contentKey="lesson.content">Content</Translate> *
              </Label>
              <div className="position-relative">
                <ReactQuill
                  id="lesson-content-editor"
                  theme="snow"
                  value={editedLesson.content}
                  onChange={content => setEditedLesson(prev => ({ ...prev, content }))}
                  modules={quillModules}
                  formats={quillFormats}
                  readOnly={readOnly}
                  style={{ minHeight: '250px' }}
                  placeholder={translate('lesson.content.placeholder', 'Enter lesson content...')}
                />
                {!readOnly && (
                  <small className="text-muted mt-1 d-block">
                    <Translate contentKey="lesson.content.help">
                      Use the toolbar above to format your content. You can add headings, lists, links, images, and more.
                    </Translate>
                  </small>
                )}
              </div>
              {errors.content && <div className="text-danger mt-1 small">{errors.content}</div>}
            </FormGroup>

            {/* Video Upload */}
            <FormGroup>
              <Label>
                <Translate contentKey="lesson.video">Video</Translate>
              </Label>
              <div
                {...getVideoRootProps()}
                className={`dropzone ${isVideoDragActive ? 'active' : ''} ${isVideoDragReject ? 'reject' : ''} ${readOnly ? 'disabled' : ''}`}
                style={{
                  border: `2px dashed ${isVideoDragReject ? '#dc3545' : isVideoDragActive ? '#007bff' : '#ccc'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: readOnly ? 'not-allowed' : 'pointer',
                  backgroundColor: isVideoDragReject ? '#f8d7da' : isVideoDragActive ? '#e3f2fd' : '#fafafa',
                  transition: 'all 0.3s ease',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <input {...getVideoInputProps()} />
                {uploadingFiles.video ? (
                  <div className="d-flex flex-column align-items-center">
                    <Spinner size="sm" className="mb-2" />
                    <small className="text-muted">
                      <Translate contentKey="lesson.upload.uploading">Uploading...</Translate>
                    </small>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faUpload}
                      size="2x"
                      className="mb-2"
                      style={{ color: isVideoDragReject ? '#dc3545' : isVideoDragActive ? '#007bff' : '#6c757d' }}
                    />
                    <p className="mb-1">
                      {editedLesson.videoUrl ? (
                        <Translate contentKey="lesson.video.replace">Drop video to replace or click to select</Translate>
                      ) : (
                        <Translate contentKey="lesson.video.upload">Drop video here or click to select</Translate>
                      )}
                    </p>
                    <small className="text-muted">
                      <Translate contentKey="lesson.video.formats">Supported: MP4, AVI, MOV, WMV, FLV, WebM, MKV (max 100MB)</Translate>
                    </small>
                  </>
                )}
              </div>
              {editedLesson.videoUrl && (
                <div className="mt-2 p-2 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <Translate contentKey="lesson.video.current">Current video:</Translate>
                      <span className="ms-1 text-truncate" style={{ maxWidth: '200px' }}>
                        {editedLesson.videoUrl}
                      </span>
                    </small>
                    {!readOnly && (
                      <Button
                        size="sm"
                        color="danger"
                        outline
                        onClick={() => setEditedLesson(prev => ({ ...prev, videoUrl: '' }))}
                        title={translate('entity.action.delete')}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {errors.video && <div className="text-danger mt-1 small">{errors.video}</div>}
            </FormGroup>

            {/* Slide Upload */}
            <FormGroup>
              <Label>
                <Translate contentKey="lesson.slides">Slides</Translate>
              </Label>
              <div
                {...getSlideRootProps()}
                className={`dropzone ${isSlideDragActive ? 'active' : ''} ${isSlideDragReject ? 'reject' : ''} ${readOnly ? 'disabled' : ''}`}
                style={{
                  border: `2px dashed ${isSlideDragReject ? '#dc3545' : isSlideDragActive ? '#007bff' : '#ccc'}`,
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: readOnly ? 'not-allowed' : 'pointer',
                  backgroundColor: isSlideDragReject ? '#f8d7da' : isSlideDragActive ? '#e3f2fd' : '#fafafa',
                  transition: 'all 0.3s ease',
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <input {...getSlideInputProps()} />
                {uploadingFiles.slide ? (
                  <div className="d-flex flex-column align-items-center">
                    <Spinner size="sm" className="mb-2" />
                    <small className="text-muted">
                      <Translate contentKey="lesson.upload.uploading">Uploading...</Translate>
                    </small>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faUpload}
                      size="2x"
                      className="mb-2"
                      style={{ color: isSlideDragReject ? '#dc3545' : isSlideDragActive ? '#007bff' : '#6c757d' }}
                    />
                    <p className="mb-1">
                      {editedLesson.slideUrl ? (
                        <Translate contentKey="lesson.slides.replace">Drop slides to replace or click to select</Translate>
                      ) : (
                        <Translate contentKey="lesson.slides.upload">Drop slides here or click to select</Translate>
                      )}
                    </p>
                    <small className="text-muted">
                      <Translate contentKey="lesson.slides.formats">Supported: PDF, PPT, PPTX, ODP (max 50MB)</Translate>
                    </small>
                  </>
                )}
              </div>
              {editedLesson.slideUrl && (
                <div className="mt-2 p-2 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <Translate contentKey="lesson.slides.current">Current slides:</Translate>
                      <span className="ms-1 text-truncate" style={{ maxWidth: '200px' }}>
                        {editedLesson.slideUrl}
                      </span>
                    </small>
                    {!readOnly && (
                      <Button
                        size="sm"
                        color="danger"
                        outline
                        onClick={() => setEditedLesson(prev => ({ ...prev, slideUrl: '' }))}
                        title={translate('entity.action.delete')}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {errors.slide && <div className="text-danger mt-1 small">{errors.slide}</div>}
            </FormGroup>

            {/* Flashcards Section */}
            <FormGroup>
              <Label>
                <Translate contentKey="lesson.flashcards">Flashcards</Translate>
              </Label>

              {/* Add New Flashcard */}
              {!readOnly && (
                <Card className="mb-3 border-primary">
                  <CardBody>
                    <h6 className="text-primary mb-3">
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      <Translate contentKey="lesson.flashcards.add">Add New Flashcard</Translate>
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <FormGroup>
                          <Label>
                            <Translate contentKey="lesson.flashcards.term">Term</Translate> *
                          </Label>
                          <Input
                            type="text"
                            value={newFlashcard.term || ''}
                            onChange={e => setNewFlashcard(prev => ({ ...prev, term: e.target.value }))}
                            placeholder={translate('lesson.flashcards.term.placeholder')}
                          />
                        </FormGroup>
                      </div>
                      <div className="col-md-6">
                        <FormGroup>
                          <Label>
                            <Translate contentKey="lesson.flashcards.hint">Hint</Translate>
                          </Label>
                          <Input
                            type="text"
                            value={newFlashcard.hint || ''}
                            onChange={e => setNewFlashcard(prev => ({ ...prev, hint: e.target.value }))}
                            placeholder={translate('lesson.flashcards.hint.placeholder')}
                          />
                        </FormGroup>
                      </div>
                    </div>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="lesson.flashcards.definition">Definition</Translate> *
                      </Label>
                      <Input
                        type="textarea"
                        rows={3}
                        value={newFlashcard.definition || ''}
                        onChange={e => setNewFlashcard(prev => ({ ...prev, definition: e.target.value }))}
                        placeholder={translate('lesson.flashcards.definition.placeholder')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="lesson.flashcards.image">Image</Translate>
                      </Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const imageUrl = await handleFlashcardImageUpload(file);
                              setNewFlashcard(prev => ({ ...prev, imageUrl }));
                            } catch (error: any) {
                              setErrors(prev => ({ ...prev, flashcardImage: error.message }));
                            }
                          }
                        }}
                      />
                      {newFlashcard.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={newFlashcard.imageUrl}
                            alt="Flashcard preview"
                            style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }}
                            className="rounded"
                          />
                          <Button
                            size="sm"
                            color="danger"
                            outline
                            className="ms-2"
                            onClick={() => setNewFlashcard(prev => ({ ...prev, imageUrl: undefined }))}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      )}
                      {errors.flashcardImage && <div className="text-danger mt-1 small">{errors.flashcardImage}</div>}
                    </FormGroup>
                    <div className="d-flex justify-content-end">
                      <Button color="primary" size="sm" onClick={addFlashcard} disabled={!newFlashcard.term || !newFlashcard.definition}>
                        <FontAwesomeIcon icon={faPlus} className="me-1" />
                        <Translate contentKey="lesson.flashcards.add.button">Add Flashcard</Translate>
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Existing Flashcards */}
              {flashcards.map((flashcard, index) => (
                <Card key={index} className="mb-2">
                  <CardBody>
                    {editingFlashcard === index ? (
                      <FlashcardEditor
                        flashcard={flashcard}
                        onSave={updatedFlashcard => updateFlashcard(index, updatedFlashcard)}
                        onCancel={() => setEditingFlashcard(null)}
                        onImageUpload={handleFlashcardImageUpload}
                      />
                    ) : (
                      <FlashcardDisplay
                        flashcard={flashcard}
                        index={index}
                        onEdit={() => setEditingFlashcard(index)}
                        onDelete={() => deleteFlashcard(index)}
                        onMoveUp={index > 0 ? () => moveFlashcard(index, index - 1) : undefined}
                        onMoveDown={index < flashcards.length - 1 ? () => moveFlashcard(index, index + 1) : undefined}
                        readOnly={readOnly}
                      />
                    )}
                  </CardBody>
                </Card>
              ))}
            </FormGroup>

            {/* Action Buttons */}
            {!readOnly && (
              <div className="d-flex justify-content-end">
                <Button color="primary" onClick={handleSave} disabled={loading}>
                  {loading ? <Spinner size="sm" className="me-1" /> : <FontAwesomeIcon icon={faSave} className="me-1" />}
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </div>
            )}
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

// Enhanced Flashcard Display Component
const FlashcardDisplay: React.FC<{
  flashcard: IFlashcard;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  readOnly: boolean;
}> = ({ flashcard, index, onEdit, onDelete, onMoveUp, onMoveDown, readOnly }) => (
  <div className="flashcard-display">
    <div className="d-flex justify-content-between align-items-start">
      <div className="flex-grow-1">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h6 className="mb-1">
              <span className="badge bg-secondary me-2">{index + 1}</span>
              <strong>{flashcard.term}</strong>
              {flashcard.hint && <small className="text-muted ms-2">({flashcard.hint})</small>}
            </h6>
            <p className="mb-2">{flashcard.definition}</p>
          </div>
          {flashcard.imageUrl && (
            <div className="ms-3">
              <img
                src={flashcard.imageUrl}
                alt={`Flashcard ${index + 1} image`}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #dee2e6',
                }}
              />
            </div>
          )}
        </div>
      </div>
      {!readOnly && (
        <div className="btn-group btn-group-sm ms-2">
          <Button size="sm" color="outline-secondary" onClick={onEdit} title={translate('entity.action.edit')}>
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          {onMoveUp && (
            <Button size="sm" color="outline-secondary" onClick={onMoveUp} title={translate('lesson.flashcards.moveUp')}>
              ↑
            </Button>
          )}
          {onMoveDown && (
            <Button size="sm" color="outline-secondary" onClick={onMoveDown} title={translate('lesson.flashcards.moveDown')}>
              ↓
            </Button>
          )}
          <Button size="sm" color="outline-danger" onClick={onDelete} title={translate('entity.action.delete')}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )}
    </div>
  </div>
);

// Enhanced Flashcard Editor Component
const FlashcardEditor: React.FC<{
  flashcard: IFlashcard;
  onSave: (flashcard: IFlashcard) => void;
  onCancel: () => void;
  onImageUpload?: (file: File) => Promise<string>;
}> = ({ flashcard, onSave, onCancel, onImageUpload }) => {
  const [editedFlashcard, setEditedFlashcard] = useState<IFlashcard>(flashcard);
  const [imageError, setImageError] = useState<string>('');

  const handleSave = () => {
    if (editedFlashcard.term && editedFlashcard.definition) {
      onSave(editedFlashcard);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!onImageUpload) return;

    try {
      setImageError('');
      const imageUrl = await onImageUpload(file);
      setEditedFlashcard(prev => ({ ...prev, imageUrl }));
    } catch (error: any) {
      setImageError(error.message);
    }
  };

  return (
    <div className="flashcard-editor bg-light p-3 rounded">
      <h6 className="text-primary mb-3">
        <FontAwesomeIcon icon={faEdit} className="me-2" />
        <Translate contentKey="lesson.flashcards.edit">Edit Flashcard</Translate>
      </h6>

      <div className="row">
        <div className="col-md-6">
          <FormGroup>
            <Label>
              <Translate contentKey="lesson.flashcards.term">Term</Translate> *
            </Label>
            <Input
              type="text"
              value={editedFlashcard.term}
              onChange={e => setEditedFlashcard(prev => ({ ...prev, term: e.target.value }))}
              placeholder={translate('lesson.flashcards.term.placeholder')}
            />
          </FormGroup>
        </div>
        <div className="col-md-6">
          <FormGroup>
            <Label>
              <Translate contentKey="lesson.flashcards.hint">Hint</Translate>
            </Label>
            <Input
              type="text"
              value={editedFlashcard.hint || ''}
              onChange={e => setEditedFlashcard(prev => ({ ...prev, hint: e.target.value }))}
              placeholder={translate('lesson.flashcards.hint.placeholder')}
            />
          </FormGroup>
        </div>
      </div>

      <FormGroup>
        <Label>
          <Translate contentKey="lesson.flashcards.definition">Definition</Translate> *
        </Label>
        <Input
          type="textarea"
          rows={3}
          value={editedFlashcard.definition}
          onChange={e => setEditedFlashcard(prev => ({ ...prev, definition: e.target.value }))}
          placeholder={translate('lesson.flashcards.definition.placeholder')}
        />
      </FormGroup>

      <FormGroup>
        <Label>
          <Translate contentKey="lesson.flashcards.image">Image</Translate>
        </Label>
        {onImageUpload && (
          <Input
            type="file"
            accept="image/*"
            onChange={async e => {
              const file = e.target.files?.[0];
              if (file) {
                await handleImageUpload(file);
              }
            }}
          />
        )}
        {editedFlashcard.imageUrl && (
          <div className="mt-2 d-flex align-items-center">
            <img
              src={editedFlashcard.imageUrl}
              alt="Flashcard preview"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #dee2e6',
              }}
            />
            <Button
              size="sm"
              color="danger"
              outline
              className="ms-2"
              onClick={() => setEditedFlashcard(prev => ({ ...prev, imageUrl: undefined }))}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </div>
        )}
        {imageError && <div className="text-danger mt-1 small">{imageError}</div>}
      </FormGroup>

      <div className="d-flex justify-content-end">
        <Button size="sm" color="secondary" onClick={onCancel} className="me-2">
          <FontAwesomeIcon icon={faCancel} className="me-1" />
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>
        <Button size="sm" color="primary" onClick={handleSave} disabled={!editedFlashcard.term || !editedFlashcard.definition}>
          <FontAwesomeIcon icon={faSave} className="me-1" />
          <Translate contentKey="entity.action.save">Save</Translate>
        </Button>
      </div>
    </div>
  );
};

export default LessonContentEditor;
