// Obtener el protocolo, el host y el puerto del cliente desde window.location
const protocol = window.location.protocol; // Obtiene el protocolo (por ejemplo, "http:" o "https:")
const host = window.location.hostname; // Obtiene el host
const port = 80; // Obtiene el puerto


export const API_URL = `${protocol}//${host}:${port}`;

