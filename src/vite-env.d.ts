/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_IMAGE_BASE: string
  readonly SECURE_LOCAL_STORAGE_HASH_KEY: string
  readonly VITE_TINYMCE_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
