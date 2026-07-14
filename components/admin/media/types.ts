export type ImagenProducto = {
  id: number;
  productoId: number;
  url: string;
  publicId: string | null;
  alt: string | null;
  orden: number;
  esPrincipal: boolean;
};

export type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

export type CloudinarySignatureResponse = {
  timestamp: number;
  signature: string;
  folder: string;
  apiKey: string;
  cloudName: string;
};