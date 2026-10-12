/* ============================================================
   BELLEZA & ESTILO — funcionalidad principal
   Archivo: js/Js.js
   Videos de servicios: assets/videos/unas.mp4,
                        assets/videos/alaciado.mp4,
                        assets/videos/pestanas.mp4
   ============================================================ */
(() => {
    "use strict";

    const WHATSAPP_NEGOCIO = "5214773148622";
    const RUTA_IMAGEN = "assets/img/";
    const RUTA_VIDEO = "assets/videos/";

    // Mantén precio y duración vacíos hasta confirmar los datos reales.
    const SERVICIOS = [
        {
            id: "unas",
            nombre: "Aplicación de uñas",
            categoria: "uñas",
            descripcion: "Diseños personalizados para realzar tu estilo.",
            precio: "",
            duracion: "",
            video: RUTA_VIDEO + "unas.mp4"
        },
        {
            id: "alaciados",
            nombre: "Alaciados",
            categoria: "cabello",
            descripcion: "Servicios de alaciado para conseguir el acabado que deseas.",
            precio: "",
            duracion: "",
            video: RUTA_VIDEO + "d.mp4"
        },
        {
            id: "pestanas",
            nombre: "Pestañas",
            categoria: "pestañas",
            descripcion: "Realza tu mirada con un servicio personalizado.",
            precio: "",
            duracion: "",
            video: RUTA_VIDEO + "pestanas.mp4"
        }
    ];

    const GALERIA = [
        { categoria: "uñas", imagen: RUTA_IMAGEN + "uñas.jpg", descripcion: "Diseño de uñas" },
        { categoria: "uñas", imagen: RUTA_IMAGEN + "manicura.jpg", descripcion: "Manicure y diseño" },
        { categoria: "uñas", imagen: RUTA_IMAGEN + "diseño.jpg", descripcion: "Uñas personalizadas" },
        { categoria: "cabello", imagen: RUTA_IMAGEN + "lacio.jpg", descripcion: "Servicio de alaciado" },
        { categoria: "cabello", imagen: RUTA_IMAGEN + "alaciado.jpg", descripcion: "Acabado de cabello" },
        { categoria: "pestañas", imagen: RUTA_IMAGEN + "pestañas.jpg", descripcion: "Aplicación de pestañas" },
        { categoria: "pestañas", imagen: RUTA_IMAGEN + "vista.jpg", descripcion: "Diseño de mirada" }
    ];

    // Agrega promociones reales aquí cuando estén definidas.
    const PROMOCIONES = [];
    // Agrega enlaces reales cuando tengas las redes sociales del negocio.
    const REDES_SOCIALES = [];

    const obtener = id => document.getElementById(id);

    function escaparHTML(valor) {
        return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[caracter]);
    }

    function normalizarTexto(valor) {
        return String(valor ?? "").normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }

    function formatearPrecio(precio) {
        if (precio === "" || precio === null || precio === undefined) return "";
        if (typeof precio === "string" && precio.trim() !== "" && !Number.isFinite(Number(precio))) {
            return precio;
        }
        const numero = Number(precio);
        if (!Number.isFinite(numero)) return String(precio);
        return numero.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
    }

    function obtenerFechaLocal() {
        const ahora = new Date();
        return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 10);
    }

    function enlaceWhatsApp(mensaje = "") {
        const numero = WHATSAPP_NEGOCIO.replace(/\D/g, "");
        return `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ""}`;
    }

    function abrirWhatsApp(mensaje) {
        // Se llama directamente desde una acción del usuario para reducir bloqueos.
        window.open(enlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
    }

    function configurarEnlaces() {
        const year = obtener("year");
        if (year) year.textContent = new Date().getFullYear();

        const mensaje = "Hola, quiero información sobre sus servicios de belleza.";
        ["btnWhatsContacto", "btnWhatsFloat", "whatsappLink"].forEach(id => {
            const enlace = obtener(id);
            if (!enlace) return;
            enlace.href = enlaceWhatsApp(mensaje);
            enlace.target = "_blank";
            enlace.rel = "noopener noreferrer";
        });

        const contactoWhatsapp = obtener("contactoWhatsapp");
        if (contactoWhatsapp) contactoWhatsapp.textContent = "+52 1 477 314 8622";

        const logoNombre = obtener("logoNombre");
        const footerNombre = obtener("footerNombre");
        if (logoNombre) logoNombre.innerHTML = "Belleza <span>&amp; Estilo</span>";
        if (footerNombre) footerNombre.textContent = "Belleza & Estilo";
    }

    function obtenerServicioPorNombre(nombre) {
        const buscado = normalizarTexto(nombre);
        return SERVICIOS.find(servicio =>
            normalizarTexto(servicio.nombre) === buscado || normalizarTexto(servicio.id) === buscado
        );
    }

    function seleccionarServicio(servicio) {
        const selector = obtener("servicio");
        const campoPrecio = obtener("precio");
        const detalle = obtener("detalleServicio");

        if (selector) selector.value = servicio.nombre;
        if (campoPrecio) campoPrecio.value = formatearPrecio(servicio.precio);
        if (detalle) {
            detalle.textContent = servicio.duracion
                ? `Duración aproximada: ${servicio.duracion}`
                : "Duración por confirmar con el estudio.";
        }
        actualizarResumenCita();

        const formulario = obtener("formCita");
        if (formulario) formulario.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderizarServicios(filtro = "todas") {
        const contenedor = obtener("gridServicios");
        if (!contenedor) return;

        const categoriaFiltro = normalizarTexto(filtro);
        const lista = SERVICIOS.filter(servicio =>
            categoriaFiltro === "todas" || categoriaFiltro === "todos" ||
            normalizarTexto(servicio.categoria) === categoriaFiltro
        );

        if (!lista.length) {
            contenedor.innerHTML = '<div class="col-12"><p class="mensaje-vacio text-center">Próximamente tendremos servicios en esta categoría.</p></div>';
            return;
        }

        contenedor.innerHTML = lista.map(servicio => {
            const precio = formatearPrecio(servicio.precio);
            const duracion = servicio.duracion ? escaparHTML(servicio.duracion) : "";
            return `
                <div class="col-12 col-sm-6 col-lg-4">
                    <article class="servicio-card h-100">
                        <div class="servicio-video-contenedor">
                            <video class="servicio-video" autoplay muted loop playsinline preload="metadata"
                                aria-label="Video de ${escaparHTML(servicio.nombre)}">
                                <source src="${escaparHTML(servicio.video)}" type="video/mp4">
                                Tu navegador no puede reproducir este video.
                            </video>
                        </div>
                        <div class="servicio-card-contenido">
                            <h3>${escaparHTML(servicio.nombre)}</h3>
                            <p>${escaparHTML(servicio.descripcion)}</p>
                            ${precio ? `<p class="precio">${escaparHTML(precio)}</p>` : ""}
                            ${duracion ? `<p class="duracion">Duración aproximada: ${duracion}</p>` : ""}
                            <button type="button" class="btn btn-primary rounded-pill btn-servicio"
                                data-solicitar-servicio="${escaparHTML(servicio.id)}">
                                Solicitar cita
                            </button>
                        </div>
                    </article>
                </div>`;
        }).join("");

        contenedor.querySelectorAll("[data-solicitar-servicio]").forEach(boton => {
            boton.addEventListener("click", () => {
                const servicio = SERVICIOS.find(item => item.id === boton.dataset.solicitarServicio);
                if (servicio) seleccionarServicio(servicio);
            });
        });

        // Intenta iniciar cada video. Algunos navegadores pueden impedir autoplay.
        contenedor.querySelectorAll("video.servicio-video").forEach(video => {
            video.muted = true;
            const reproduccion = video.play();
            if (reproduccion && typeof reproduccion.catch === "function") {
                reproduccion.catch(() => {
                    // No se muestra error: el navegador puede exigir interacción.
                });
            }
        });
    }

    function configurarFiltrosServicios() {
        const botones = document.querySelectorAll("#filtrosServicios [data-categoria]");
        botones.forEach(boton => {
            boton.setAttribute("aria-pressed", String(boton.classList.contains("active")));
            boton.addEventListener("click", () => {
                const categoria = boton.dataset.categoria || "todas";
                botones.forEach(item => {
                    const activo = item === boton;
                    item.classList.toggle("active", activo);
                    item.setAttribute("aria-pressed", String(activo));
                });
                renderizarServicios(categoria);
            });
        });
    }

    function configurarSelectorServicios() {
        const selector = obtener("servicio");
        if (!selector) return;

        selector.replaceChildren();
        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Selecciona un servicio";
        selector.appendChild(inicial);

        SERVICIOS.forEach(servicio => {
            const opcion = document.createElement("option");
            opcion.value = servicio.nombre;
            opcion.textContent = servicio.nombre;
            selector.appendChild(opcion);
        });

        selector.addEventListener("change", () => {
            const servicio = obtenerServicioPorNombre(selector.value);
            const campoPrecio = obtener("precio");
            const detalle = obtener("detalleServicio");
            if (campoPrecio) campoPrecio.value = servicio ? formatearPrecio(servicio.precio) : "";
            if (detalle) {
                detalle.textContent = !servicio
                    ? "Elige un servicio para ver su duración aproximada."
                    : servicio.duracion
                        ? `Duración aproximada: ${servicio.duracion}`
                        : "Duración por confirmar con el estudio.";
            }
            actualizarResumenCita();
        });
    }

    function renderizarGaleria(filtro = "todas") {
        const contenedor = obtener("gridGaleria");
        if (!contenedor) return;
        const categoriaFiltro = normalizarTexto(filtro);
        const lista = GALERIA.filter(item =>
            categoriaFiltro === "todas" || categoriaFiltro === "todos" ||
            normalizarTexto(item.categoria) === categoriaFiltro
        );

        if (!lista.length) {
            contenedor.innerHTML = '<div class="col-12"><p class="mensaje-vacio text-center">Todavía no hay fotografías para esta categoría.</p></div>';
            return;
        }

        contenedor.innerHTML = lista.map(item => `
            <div class="col-6 col-md-4 col-lg-3">
                <figure class="galeria-item h-100">
                    <img src="${escaparHTML(item.imagen)}" alt="${escaparHTML(item.descripcion)}" loading="lazy">
                    <figcaption>${escaparHTML(item.descripcion)}</figcaption>
                </figure>
            </div>`).join("");
    }

    function configurarFiltrosGaleria() {
        const botones = document.querySelectorAll("#filtrosGaleria [data-categoria]");
        botones.forEach(boton => {
            boton.setAttribute("aria-pressed", String(boton.classList.contains("active")));
            boton.addEventListener("click", () => {
                const categoria = boton.dataset.categoria || "todas";
                botones.forEach(item => {
                    const activo = item === boton;
                    item.classList.toggle("active", activo);
                    item.setAttribute("aria-pressed", String(activo));
                });
                renderizarGaleria(categoria);
            });
        });
    }

    function renderizarPromociones() {
        const contenedor = obtener("gridPromociones");
        if (!contenedor) return;

        if (!PROMOCIONES.length) {
            contenedor.innerHTML = `
                <div class="col-12">
                    <p class="mensaje-vacio text-center">Consulta por WhatsApp las promociones disponibles.</p>
                    <div class="text-center">
                        <a class="btn btn-primary rounded-pill"
                           href="${enlaceWhatsApp("Hola, quisiera conocer las promociones vigentes.")}"
                           target="_blank" rel="noopener noreferrer">Consultar promociones</a>
                    </div>
                </div>`;
            return;
        }

        contenedor.innerHTML = PROMOCIONES.map(promocion => `
            <div class="col-12 col-sm-6 col-lg-4">
                <article class="promocion-card h-100">
                    ${promocion.imagen ? `<img src="${escaparHTML(promocion.imagen)}" alt="${escaparHTML(promocion.nombre)}" loading="lazy">` : ""}
                    <div class="promocion-card-contenido">
                        <h3>${escaparHTML(promocion.nombre)}</h3>
                        <p>${escaparHTML(promocion.descripcion)}</p>
                        ${promocion.precio !== undefined && promocion.precio !== "" ? `<p class="precio">${escaparHTML(formatearPrecio(promocion.precio))}</p>` : ""}
                        <button type="button" class="btn btn-primary rounded-pill" data-consultar-promocion="${escaparHTML(promocion.nombre)}">Consultar promoción</button>
                    </div>
                </article>
            </div>`).join("");

        contenedor.querySelectorAll("[data-consultar-promocion]").forEach(boton => {
            boton.addEventListener("click", () => abrirWhatsApp(
                `Hola, quisiera información sobre la promoción: ${boton.dataset.consultarPromocion}`
            ));
        });
    }

    function configurarRedesSociales() {
        const contenedor = obtener("redesSociales");
        if (!contenedor) return;
        const redesValidas = REDES_SOCIALES.filter(red => /^https?:\/\//i.test(red.url || ""));
        if (!redesValidas.length) {
            contenedor.textContent = "Próximamente compartiremos nuestras redes sociales.";
            return;
        }
        contenedor.innerHTML = redesValidas.map(red => `
            <a href="${escaparHTML(red.url)}" target="_blank" rel="noopener noreferrer">
                ${escaparHTML(red.nombre)}
            </a>`).join("");
    }

    function actualizarResumenCita() {
        const resumen = obtener("resumenCita");
        const lista = obtener("listaResumen");
        const formulario = obtener("formCita");
        if (!resumen || !lista || !formulario) return;

        const datos = new FormData(formulario);
        const campos = [
            ["Nombre", datos.get("nombre")],
            ["Servicio", datos.get("servicio")],
            ["Precio", datos.get("precio")],
            ["Fecha", datos.get("fecha")],
            ["Horario", datos.get("hora")]
        ];
        const llenos = campos.filter(([, valor]) => String(valor ?? "").trim() !== "");
        lista.innerHTML = llenos.length
            ? llenos.map(([etiqueta, valor]) => `<li><strong>${escaparHTML(etiqueta)}:</strong> ${escaparHTML(valor)}</li>`).join("")
            : "<li>Completa el formulario para ver el resumen.</li>";
    }

    function configurarFormularioCita() {
        const formulario = obtener("formCita");
        if (!formulario) return;
        const campoFecha = obtener("fecha");
        if (campoFecha) campoFecha.min = obtenerFechaLocal();

        formulario.addEventListener("input", actualizarResumenCita);
        formulario.addEventListener("change", actualizarResumenCita);

        formulario.addEventListener("submit", evento => {
            evento.preventDefault();
            const datos = new FormData(formulario);
            const nombre = String(datos.get("nombre") || "").trim();
            const telefono = String(datos.get("telefono") || "").trim();
            const telefonoDigitos = telefono.replace(/\D/g, "");
            const servicioNombre = String(datos.get("servicio") || "").trim();
            const fecha = String(datos.get("fecha") || "").trim();
            const hora = String(datos.get("hora") || "").trim();
            const comentarios = String(datos.get("comentarios") || "").trim();
            const servicio = obtenerServicioPorNombre(servicioNombre);

            if (!nombre || !telefono || !servicio || !fecha || !hora) {
                alert("Completa todos los campos obligatorios y selecciona un servicio válido.");
                return;
            }
            if (telefonoDigitos.length < 10) {
                alert("Escribe un teléfono de contacto válido de al menos 10 dígitos.");
                const campoTelefono = obtener("telefono");
                if (campoTelefono) campoTelefono.focus();
                return;
            }
            if (fecha < obtenerFechaLocal()) {
                alert("Selecciona una fecha de hoy o posterior.");
                if (campoFecha) campoFecha.focus();
                return;
            }

            const precio = formatearPrecio(servicio.precio) || "Por confirmar";
            const mensaje = [
                "Hola, quiero solicitar una cita de belleza.", "",
                `Nombre: ${nombre}`,
                `Mi teléfono: ${telefono}`,
                `Servicio: ${servicioNombre}`,
                `Precio: ${precio}`,
                `Fecha deseada: ${fecha}`,
                `Hora preferida: ${hora}`,
                `Comentarios: ${comentarios || "Ninguno"}`,
                "",
                "Entiendo que la cita queda pendiente hasta recibir confirmación."
            ].join("\n");

            actualizarResumenCita();
            abrirWhatsApp(mensaje);
        });
        actualizarResumenCita();
    }

    function configurarBotonArriba() {
        const boton = obtener("btnArriba");
        if (!boton) return;
        boton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    function iniciar() {
        configurarEnlaces();
        renderizarServicios();
        configurarFiltrosServicios();
        configurarSelectorServicios();
        renderizarGaleria();
        configurarFiltrosGaleria();
        renderizarPromociones();
        configurarRedesSociales();
        configurarFormularioCita();
        configurarBotonArriba();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
