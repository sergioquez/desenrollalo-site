# GitHub Pages - Guía de Limitaciones para desenrollalo-site

## 🚫 Limitaciones Críticas a Considerar

### 1. **NO hay backend**
- Todo debe ejecutarse en el cliente (navegador)
- No podemos tener: PHP, Node.js, Python en el servidor
- No hay bases de datos del lado del servidor

### 2. **Límites de Tamaño**
- **Archivos individuales**: Máximo 100MB (rechazo)
- **Advertencia**: 50MB (GitHub te avisa)
- **Repositorio completo**: Recomendado <1GB
- **Sitio publicado**: Máximo 1GB
- **Bandwidth mensual**: ~100GB (límite blando)

### 3. **Límites de Tiempo**
- **Build timeout**: 10 minutos máximo
- Si el deploy tarda más de 10 minutos, falla

## ✅ Lo que SÍ funciona en nuestro proyecto

### JavaScript en el Cliente
```javascript
// TODO esto funciona:
- localStorage/sessionStorage
- Timer con setInterval
- Cálculos matemáticos
- Manipulación del DOM
- Consumo de APIs externas (si tienen CORS)
```

### Assets Permitidos
- HTML, CSS, JavaScript
- Imágenes (optimizadas: WebP, AVIF)
- Fuentes (WOFF2)
- Audio/Video pequeños (<10MB recomendado)
- JSON estáticos

## 🛠️ Mejores Prácticas para desenrollalo-site

### 1. **Optimizar Imágenes**
```bash
# Convertir a WebP/AVIF
# Mantener < 100KB por imagen
# Usar lazy loading
```

### 2. **JavaScript Eficiente**
```javascript
// BUENAS PRÁCTICAS:
- Minificar código en producción
- Usar `defer` o `async` en scripts
- Evitar librerías pesadas innecesarias
- Tree-shaking si usamos bundler
```

### 3. **Estructura del Proyecto**
```
desenrollalo-site/
├── index.html          # < 10KB
├── style.css          # < 50KB (minificado)
├── app.js            # < 100KB (minificado)
├── analytics.js      # < 20KB
├── assets/
│   ├── alert.mp3     # < 500KB (audio corto)
│   └── (imágenes)    # < 100KB cada una
└── .github/workflows/deploy.yml
```

### 4. **Monitorear el Deploy**
- Verificar que el build tarde < 2 minutos
- Revisar GitHub Actions logs después de cada push
- Verificar tamaño del repo: `git count-objects -vH`

## 🚨 Señales de Problemas

### Si el deploy falla:
1. **Timeout (>10min)**: Simplificar build process
2. **Tamaño excesivo**: Optimizar assets
3. **Error 429**: Rate limiting, esperar y reintentar

### Si el sitio es lento:
1. **Assets grandes**: Comprimir imágenes/JS
2. **Muchas requests**: Combinar archivos
3. **Sin CDN**: Considerar Cloudflare

## 🔄 Flujo de Trabajo Seguro

```
[Desarrollo Local] → [Test Local] → [Commit] → [Push] → [GitHub Actions] → [Deploy]
       ↓                   ↓           ↓         ↓           ↓               ↓
    Cambios           npm test      git add   git push    Build <10min   GitHub Pages
```

## 📊 Estado Actual del Proyecto (Abril 2026)

| Métrica | Valor | Límite | Status |
|---------|-------|--------|--------|
| **Tamaño repo** | ~1MB | 1GB | ✅ Seguro |
| **Archivo más grande** | ~50KB (app.js) | 100MB | ✅ Seguro |
| **Build time** | ~1-2 min | 10 min | ✅ Seguro |
| **JS total** | ~150KB | - | ✅ Optimizado |
| **CSS total** | ~30KB | - | ✅ Optimizado |

## 🎯 Recomendaciones para Futuras Funcionalidades

### ✅ Aceptable (solo frontend):
- Mejorar UI/UX
- Agregar más cálculos
- LocalStorage para preferencias
- Service Worker (PWA)
- Más sonidos/alertas (pequeños)

### ⚠️ Requiere Consideración:
- **Imágenes grandes** → Usar CDN externo
- **Videos tutoriales** → YouTube/Vimeo embed
- **Muchos assets** → Cloudflare Pages + R2

### 🚫 No Factible (sin backend):
- Guardar datos de usuarios en servidor
- Sistema de comentarios nativo
- Upload de imágenes de usuarios
- API propia con autenticación

---

**Para referencia rápida durante desarrollo:**
- ¿Requiere backend? → NO en GitHub Pages
- ¿Archivo > 50MB? → NO en el repo
- ¿Build > 5min? → OPTIMIZAR
- ¿Necesita base de datos? → Firebase/Supabase (client-side)

**Última verificación**: Deploy exitoso después de fix del botón "Calcular"