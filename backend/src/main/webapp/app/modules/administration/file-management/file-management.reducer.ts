import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  uploading: false,
  uploadProgress: 0,
  errorMessage: null as unknown as string,
  folderStructure: null as any,
  currentFolderFiles: [] as any[],
  searchResults: [] as any[],
  filePreview: null as any,
  updateSuccess: false,
  deleteSuccess: false,
};

export type FileManagementState = Readonly<typeof initialState>;

// Actions
export const getFolderStructure = createAsyncThunk(
  'fileManagement/fetch_folder_structure',
  async (path: string) => {
    const requestUrl = `api/admin/files/structure${path ? `?path=${encodeURIComponent(path)}` : ''}`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const searchFiles = createAsyncThunk(
  'fileManagement/search_files',
  async (params: { query?: string; folder?: string; mimeType?: string }) => {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.folder) searchParams.append('folder', params.folder);
    if (params.mimeType) searchParams.append('mimeType', params.mimeType);

    const requestUrl = `api/admin/files/search?${searchParams.toString()}`;
    return axios.get<any[]>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

export const uploadFile = createAsyncThunk(
  'fileManagement/upload_file',
  async (params: { file: File; folder?: string; description?: string; isPublic?: boolean }, { dispatch }) => {
    const formData = new FormData();
    formData.append('file', params.file);
    if (params.folder) formData.append('folder', params.folder);
    if (params.description) formData.append('description', params.description);
    if (params.isPublic !== undefined) formData.append('isPublic', params.isPublic.toString());

    return axios.post('api/admin/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress(progressEvent) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch(setUploadProgress(progress));
      },
    });
  },
  { serializeError: serializeAxiosError },
);

export const deleteFile = createAsyncThunk(
  'fileManagement/delete_file',
  async (fileId: string) => {
    const requestUrl = `api/admin/files/${fileId}`;
    await axios.delete(requestUrl);
    return fileId;
  },
  { serializeError: serializeAxiosError },
);

export const createFolder = createAsyncThunk(
  'fileManagement/create_folder',
  async (folderPath: string) => {
    const requestUrl = 'api/admin/files/folders';
    return axios.post(requestUrl, { path: folderPath });
  },
  { serializeError: serializeAxiosError },
);

export const deleteFolder = createAsyncThunk(
  'fileManagement/delete_folder',
  async (folderPath: string) => {
    const requestUrl = `api/admin/files/folders?path=${encodeURIComponent(folderPath)}`;
    await axios.delete(requestUrl);
    return folderPath;
  },
  { serializeError: serializeAxiosError },
);

export const updateFileMetadata = createAsyncThunk(
  'fileManagement/update_file_metadata',
  async (params: { fileId: string; metadata: any }) => {
    const requestUrl = `api/admin/files/${params.fileId}/metadata`;
    return axios.put(requestUrl, params.metadata);
  },
  { serializeError: serializeAxiosError },
);

export const getFilePreview = createAsyncThunk(
  'fileManagement/get_file_preview',
  async (fileId: string) => {
    const requestUrl = `api/admin/files/${fileId}/preview`;
    return axios.get<any>(requestUrl);
  },
  { serializeError: serializeAxiosError },
);

// Slice
export const FileManagementSlice = createSlice({
  name: 'fileManagement',
  initialState,
  reducers: {
    reset() {
      return initialState;
    },
    setUploadProgress(state, action) {
      state.uploadProgress = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
  extraReducers(builder) {
    builder
      // Get folder structure
      .addCase(getFolderStructure.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getFolderStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.folderStructure = action.payload.data;
        // Extract files from the current folder
        if (action.payload.data && action.payload.data.children) {
          state.currentFolderFiles = action.payload.data.children
            .filter((item: any) => item.type === 'file')
            .map((item: any) => item.fileMetadata);
        }
      })
      .addCase(getFolderStructure.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Search files
      .addCase(searchFiles.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Upload file
      .addCase(uploadFile.pending, state => {
        state.uploading = true;
        state.uploadProgress = 0;
        state.errorMessage = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.updateSuccess = true;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 0;
        state.errorMessage = action.error.message;
      })
      // Delete file
      .addCase(deleteFile.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        // Remove deleted file from current folder files
        state.currentFolderFiles = state.currentFolderFiles.filter(file => file.id !== action.payload);
        // Remove from search results if present
        state.searchResults = state.searchResults.filter(file => file.id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Create folder
      .addCase(createFolder.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(createFolder.fulfilled, state => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Delete folder
      .addCase(deleteFolder.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(deleteFolder.fulfilled, state => {
        state.loading = false;
        state.deleteSuccess = true;
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Update file metadata
      .addCase(updateFileMetadata.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(updateFileMetadata.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        // Update file in current folder files
        if (action.payload && 'data' in action.payload) {
          const updatedFile = (action.payload as any).data;
          const index = state.currentFolderFiles.findIndex(file => file.id === updatedFile.id);
          if (index !== -1) {
            state.currentFolderFiles[index] = updatedFile;
          }
        }
      })
      .addCase(updateFileMetadata.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // Get file preview
      .addCase(getFilePreview.pending, state => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getFilePreview.fulfilled, (state, action) => {
        state.loading = false;
        state.filePreview = action.payload.data;
      })
      .addCase(getFilePreview.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      });
  },
});

export const { reset, setUploadProgress, clearSearchResults } = FileManagementSlice.actions;

// Reducer
export default FileManagementSlice.reducer;
