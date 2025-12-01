export interface Producto {
    id: number;
    titulo: string;
    imagen: string;
    forma: string; // "Circulares" o "Cuadrada"
    tamanio: string; // "Grande" o "Pequenia"
    precio: number;
    descripcion: string;
    stock?: number;
}
