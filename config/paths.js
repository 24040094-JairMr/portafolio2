// config/paths.js

/**
 * Gestor de rutas para el portafolio estático
 * Maneja rutas relativas de forma dinámica
 */
class PathManager {
    constructor() {
        // Determinar si estamos en desarrollo local o producción
        this.isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
        
        // Obtener la ruta base actual
        this.currentPath = window.location.pathname;
        this.pathSegments = this.currentPath.split('/').filter(segment => segment);
        
        // Determinar niveles de profundidad
        this.depthLevel = this.calculateDepth();
        
        // Configuración del proyecto
        this.config = {
            PROJECT_NAME: 'Portafolio de Evidencias',
            PROJECT_DESCRIPTION: 'Desarrollo Web Orientado a Servicios',
            STUDENTS: [
                'Sanchez Arroyo Deniss Esmeralda',
                'Montes Reyna Jair'
            ],
            SUBJECT: 'Desarrollo Web Orientado a Servicios',
            SEMESTER: '5° Cuatrimestre',
            YEAR: new Date().getFullYear()
        };
    }
    
    /**
     * Calcula el nivel de profundidad desde la raíz
     */
    calculateDepth() {
        // Si estamos en la raíz o en index.html
        if (this.pathSegments.length === 0 || 
            (this.pathSegments.length === 1 && this.pathSegments[0].endsWith('.html'))) {
            return 0;
        }
        
        // Contar segmentos que no son archivos .html
        let depth = 0;
        for (const segment of this.pathSegments) {
            if (!segment.endsWith('.html')) {
                depth++;
            }
        }
        return depth;
    }
    
    /**
     * Genera prefijo para rutas relativas
     */
    getRelativePrefix() {
        if (this.depthLevel === 0) return './';
        return '../'.repeat(this.depthLevel);
    }
    
    /**
     * Obtiene ruta para assets
     */
    asset(path = '') {
        return `${this.getRelativePrefix()}assets/${path}`;
    }
    
    /**
     * Obtiene ruta para CSS
     */
    css(file) {
        return `${this.getRelativePrefix()}assets/css/${file}`;
    }
    
    /**
     * Obtiene ruta para JavaScript
     */
    js(file) {
        return `${this.getRelativePrefix()}assets/js/${file}`;
    }
    
    /**
     * Obtiene ruta para imágenes
     */
    image(file) {
        return `${this.getRelativePrefix()}assets/images/${file}`;
    }
    
    /**
     * Obtiene ruta para videos
     */
    video(file) {
        return `${this.getRelativePrefix()}assets/videos/${file}`;
    }
    
    /**
     * Obtiene ruta para componentes
     */
    component(file) {
        return `${this.getRelativePrefix()}components/${file}`;
    }
    
    /**
     * Obtiene ruta para páginas
     */
    page(file) {
        // Si el archivo ya tiene extensión .html
        if (file.endsWith('.html')) {
            return `${this.getRelativePrefix()}${file}`;
        }
        return `${this.getRelativePrefix()}${file}.html`;
    }
    
    /**
     * Obtiene configuración del proyecto
     */
    getConfig() {
        return this.config;
    }
    
    /**
     * Inicializa y configura rutas en el documento
     */
    initialize() {
        // Agregar configuración al objeto global window
        window.Paths = this;
        window.CONFIG = this.config;
        
        console.log('🚀 PathManager inicializado:', {
            currentPath: this.currentPath,
            depthLevel: this.depthLevel,
            relativePrefix: this.getRelativePrefix(),
            config: this.config
        });
        
        return this;
    }
}

// Crear instancia global
const Paths = new PathManager().initialize();

// Función de utilidad para cargar componentes dinámicamente
async function loadComponent(componentName, targetElementId) {
    try {
        const componentPath = Paths.component(componentName);
        const response = await fetch(componentPath);
        
        if (!response.ok) {
            throw new Error(`Error al cargar componente: ${componentName}`);
        }
        
        const html = await response.text();
        const targetElement = document.getElementById(targetElementId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
            
            // Ejecutar scripts dentro del componente
            const scripts = targetElement.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.head.appendChild(newScript);
            });
            
            console.log(`✅ Componente cargado: ${componentName}`);
            return true;
        } else {
            console.warn(`⚠️ Elemento objetivo no encontrado: ${targetElementId}`);
            return false;
        }
    } catch (error) {
        console.error('❌ Error cargando componente:', error);
        return false;
    }
}

// Función para generar etiquetas meta dinámicas
function generateMetaTags() {
    const metaTags = `
        <!-- Meta tags dinámicas -->
        <meta property="og:title" content="${CONFIG.PROJECT_NAME}">
        <meta property="og:description" content="${CONFIG.PROJECT_DESCRIPTION}">
        <meta property="og:type" content="website">
        <meta name="description" content="${CONFIG.PROJECT_DESCRIPTION}">
        <meta name="author" content="${CONFIG.STUDENTS.join(', ')}">
        <title>${CONFIG.PROJECT_NAME} - ${CONFIG.SUBJECT}</title>
    `;
    
    const head = document.head || document.getElementsByTagName('head')[0];
    head.insertAdjacentHTML('beforeend', metaTags);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Generar meta tags automáticamente
    generateMetaTags();
    
    // Ejemplo de uso:
    // console.log('Ruta CSS:', Paths.css('main.css'));
    // console.log('Ruta JS:', Paths.js('main.js'));
    // console.log('Página inicio:', Paths.page('inicio'));
    
    // Cargar componentes automáticamente si hay contenedores
    if (document.getElementById('navigation-container')) {
        loadComponent('navigation.html', 'navigation-container');
    }
    
    if (document.getElementById('navbar-container')) {
        loadComponent('navbar.html', 'navbar-container');
    }
    
    if (document.getElementById('footer-container')) {
        loadComponent('footer.html', 'footer-container');
    }
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Paths, loadComponent };
}