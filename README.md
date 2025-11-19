# ¿Qué se ha hecho?
- El trabajo ha sido dividido en dos partes, la uno, que solo requería unos pocos cambios, y la ampliación, que requería cambiary añadir opciones, como un control de versiones con snapshots o una forma de editar las notas

## Parte 1

### Selección de persistencia (Web Storage / Cookies)
- Se selecciona el Web Storage como método para persistir los datos por diferentes motivos:
    - Tiene más almacenaje (10MB máximo frente a 4KB de las Cookies)
    - El Web Storage no genera tráfico en el HTTP, funciona solamente en el JavaScript
    - Al no viajar por la red, es más seguro que las Cookies

### Creación de la clase notaCompletada
- Se ha creado la clase notaCompletada para añadir, en caso de que sea necesario, la clase al footer y header de la nota.

### Modificación app.js
- Se ha añadido la función render, creando dos constantes donde se van a almacenar si la nota está completada o no, gracias a un operador ternario ('n.completada ? "notaCompletada" : ""').
- Se ha modificado en la función render las etiquetas de header y footer para aplicarle la clase correspondiente.

## Parte 2 (Ampliación)

### Snapshots
- Se ha añadido control con snapshots para poder restaurar una version del gestor de notas anterior, por si se quiere volver a una nota borrada o deshacer una edición.

### Edición de notas
- Se ha creado un método que permite la edición de notas en la misma línea, sin tener que abrir otra ventana o borrar todo el contenido y mostrar un único formulario donde editar la nota.
- Ésto se ha conseguido gracias a poder escoger la nota mediante el ID de la nota y repintar encima un formulario con los datos de la nota.

### Plantilla (Template)
- Se ha utilizado una plantilla para generar notas para así no tener que forzar una recarga de la página al crear una nota, y no se sobreescribe el html continuamente, simplemente se duplica la plantilla.

### CSS
- Se ha modificado el CSS haciendo más anchas las notas para que cupiese bien toda la información, se han evitado desbordamientos de texto fuera de las notas y se han añadido estilos para las diferentes prioridades, aplicando un color de fondo para la tarjeta dependiendo de la prioridad.

# Checklist
[✔] He usado Date, Math, String, Number con propósito claro
[✔] Genero HTML por código (crear/actualizar/eliminar nodos). 
[✔] Implemento filtros por location.hash. 
[✔] Muestro control básico de ventana/viewport cuando sea viable. 
[✔] Abro Panel Diario y comunico datos con seguridad (valido origen). 
[✔] Elijo y justifico cookies o Web Storage; recupero el estado al cargar
[✔] Entrego guía de usuario esquemática + README con matriz RA–CE y evidencias de depuración junto con el enlace al repositorio en GitHub

# Enlace a Git 
[Enlace a GitHub](https://github.com/Pakete-123/dwec-u3-notasapp-hortelano-torrecilla)