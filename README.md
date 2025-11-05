# Selección de persistencia (Web Storage / Cookies)
Se selecciona el Web Storage como método para persistir los datos por diferentes motivos:
    - Tiene más almacenaje (10MB máximo frente a 4KB de las Cookies)
    - El Web Storage no genera tráfico en el HTTP, funciona solamente en el JavaScript
    - Al no viajar por la red, es más seguro que las Cookies

