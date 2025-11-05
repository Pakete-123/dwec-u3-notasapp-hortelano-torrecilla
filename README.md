# Selección de persistencia (Web Storage / Cookies)
Se selecciona el Web Storage como método para persistir los datos por diferentes motivos:
    - Tiene más almacenaje (10MB máximo frente a 4KB de las Cookies)
    - El Web Storage no genera tráfico en el HTTP, funciona solamente en el JavaScript
    - Al no viajar por la red, es más seguro que las Cookies

# Creación de la clase notaCompletada
Se ha creado la clase notaCompletada para añadir, en caso de que sea necesario, la clase al footer y header de la nota.

# Modificación app.js
Se ha añadido la función render, creando dos constantes donde se van a almacenar si la nota está completada o no, gracias a la funcionalidad de 'n.completada ? "notaCompletada" : ""'
Se ha modificado en la función render las etiquetas de header y footer para aplicarle la clase correspondie