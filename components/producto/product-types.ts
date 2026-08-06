export type ProductoEspecificacion = {
  id: number;
  nombre: string;
  valor: string;
  orden: number;
};

export type ProductoDocumentoTipo =
  | "FICHA_TECNICA"
  | "MANUAL"
  | "CURVA_RENDIMIENTO"
  | "CATALOGO"
  | "CERTIFICADO"
  | "OTRO";

export type ProductoDocumentoPublico = {
  id: number;
  titulo: string;
  tipo: ProductoDocumentoTipo;
  archivoUrl: string;
  orden: number;
  visible: boolean;
};

export type ProductoRelacionadoPublico = {
  nombre: string;
  precio: number;
  imagen: string;
  href: string;
};

export type ProductoOpinionPublica = {
  id: number;
  clienteNombre: string;
  ciudad: string | null;
  comentario: string;
  calificacion: number;
  imagenUrl: string | null;
  compraVerificada: boolean;
  fecha: string;
};

export type ProductoAccesorioPublico = {
  id: number;
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
  incluido: boolean;
  orden: number;
};

export type ProductoPublico = {
  id: number;
  slug: string;
  nombre: string;
  nombreCorto: string;
  precio: number;
  precioAntes: number | null;
  imagen: string;
  imagenes: string[];
  etiqueta: string;
  modoGempages: boolean;
  descripcion: string;
  contenidoHtml: string | null;
  stock: number;
  mini: string[];
  beneficios: string[];
  accesorios: ProductoAccesorioPublico[];
  especificaciones: ProductoEspecificacion[];
  documentos: ProductoDocumentoPublico[];
  opiniones: ProductoOpinionPublica[];
  relacionados: ProductoRelacionadoPublico[];
};