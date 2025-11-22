document.addEventListener('DOMContentLoaded', function() {
    // Ajustar dinámicamente el margen superior de la franja de marca
    const navBar = document.querySelector('.nav-contenedor');
    const setNavHeightVar = () => {
        if (!navBar) return;
        const h = navBar.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', h + 'px');
    };
    setNavHeightVar();
    window.addEventListener('resize', setNavHeightVar);
    // Carrusel del encabezado: generar slides dinámicamente dentro de .header-bg-slider
    const headerSlider = document.querySelector('.header-bg-slider');
    const headerImages = [
        'img/imagen-16.jpg',
        'img/imagen-13.jpg',
        'img/imagen-09.jpg',
        'img/imagen-10.jpg',
        'img/imagen-05.jpg',
        'img/imagen-06.jpg',
        'img/imagen-07.jpg',
        'img/imagen-08.jpg',
        'img/imagen-11.jpg',
        'img/imagen-21.jpg',
    ];

    let headerSlides = [];
    let headerCurrentSlide = 0;
    let totalHeaderSlides = 0;

    if (headerSlider) {
        headerImages.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'header-slide';
            slide.style.backgroundImage = `url('${src}')`;
            headerSlider.appendChild(slide);
        });

        headerSlides = headerSlider.querySelectorAll('.header-slide');
        totalHeaderSlides = headerSlides.length;

        if (totalHeaderSlides > 0) {
            headerSlides[0].classList.add('active');

            setInterval(() => {
                headerSlides[headerCurrentSlide].classList.remove('active');
                headerCurrentSlide = (headerCurrentSlide + 1) % totalHeaderSlides;
                headerSlides[headerCurrentSlide].classList.add('active');
            }, 6000);
        }
    }

    // Inicializar el carrusel de contenido
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const carouselInner = document.querySelector('.carousel-inner');
    const totalSlides = slides.length;

    function showSlide(index) {
        if (!slides.length || !carouselInner) return;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        carouselInner.style.transform = `translateX(-${index * 100}%)`;
        updateControls();
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide = currentSlide + 1;
            showSlide(currentSlide);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide = currentSlide - 1;
            showSlide(currentSlide);
        }
    }

    // Botones del carrusel
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    
    function updateControls() {
        if (!prevButton || !nextButton) return;
        const atStart = currentSlide === 0;
        const atEnd = currentSlide === totalSlides - 1;
        prevButton.classList.toggle('disabled', atStart);
        nextButton.classList.toggle('disabled', atEnd);
        prevButton.setAttribute('aria-disabled', atStart ? 'true' : 'false');
        nextButton.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    }

    // Mostrar la primera diapositiva inicialmente
    showSlide(0);

    // Modo oscuro
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
        // Forzar modo claro por defecto al cargar
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        darkModeBtn.innerHTML = '<i class="fas fa-moon"></i>';

        darkModeBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
            darkModeBtn.innerHTML = `<i class="fas fa-${isDarkMode ? 'sun' : 'moon'}"></i>`;
        });
    }

    // Navegación y desplazamiento suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav-contenedor').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Acordeón de habitaciones
    const acordeonItems = document.querySelectorAll('.acordeon-item');
    const hoverCapable = window.matchMedia('(hover: hover)').matches;

    acordeonItems.forEach(item => {
        const header = item.querySelector('.acordeon-header');
        const detalles = item.querySelector('.acordeon-detalles');
        const btn = item.querySelector('.btn-ver-detalles');

        const toggleItem = () => {
            const isActive = item.classList.contains('activo');

            // Cerrar otros items activos
            acordeonItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('activo')) {
                    otherItem.classList.remove('activo');
                    const otherDetalles = otherItem.querySelector('.acordeon-detalles');
                    if (otherDetalles) otherDetalles.style.maxHeight = null;
                    if (otherDetalles) otherDetalles.classList.remove('activo');
                }
            });

            // Alternar estado actual
            item.classList.toggle('activo');
            if (!isActive) {
                detalles.style.maxHeight = detalles.scrollHeight + 'px';
                detalles.classList.add('activo');
            } else {
                detalles.style.maxHeight = null;
                detalles.classList.remove('activo');
            }
        };

        // Toggle al hacer clic en el encabezado
        if (header) {
            header.addEventListener('click', toggleItem);
        }

        // Toggle al hacer clic en el botón "Ver detalles" (evitar doble toggle)
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleItem();
            });
        }

        // Cerrar automáticamente al salir el cursor de la tarjeta (solo en dispositivos con hover)
        if (hoverCapable) {
            item.addEventListener('mouseleave', () => {
                if (item.classList.contains('activo')) {
                    item.classList.remove('activo');
                    detalles.style.maxHeight = null;
                    detalles.classList.remove('activo');
                }
            });
        }
    });

    // Botón de scroll hacia arriba
    const scrollTopBtn = document.getElementById('btnScrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mapa de Ubicación (Leaflet)
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof L !== 'undefined') {
        const hotelLocation = [32.536389, -117.008056];

        // Límites de arrastre (Tijuana y alrededores) y zoom adaptado
        const tijuanaBounds = L.latLngBounds(
            L.latLng(32.40, -117.20), // Sudoeste
            L.latLng(32.65, -116.80)  // Noreste
        );
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        const map = L.map('map', {
            scrollWheelZoom: true,
            minZoom: isMobile ? 13 : 11,
            maxZoom: 18,
            maxBounds: tijuanaBounds,
            maxBoundsViscosity: 0.8
        }).setView(hotelLocation, isMobile ? 15 : 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const marker = L.marker(hotelLocation).addTo(map);
        marker.bindPopup('<strong>Hotel ALCYNNE</strong><br>Avenida Azueta #1589<br>Colonia Libertad<br>Tijuana, BC');

        // Controles: Recentrar y Pantalla completa
        const btnRecenter = document.getElementById('btnMapRecenter');
        const btnFullscreen = document.getElementById('btnMapFullscreen');
        const mapaContainerEl = document.querySelector('.mapa-container');

        if (btnRecenter) {
            btnRecenter.addEventListener('click', () => {
                map.setView(hotelLocation, 16);
                marker.openPopup();
            });
        }

        if (btnFullscreen && mapaContainerEl) {
            const exitFullscreen = () => {
                mapaContainerEl.classList.remove('fullscreen');
                if (btnFullscreen) btnFullscreen.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';
                document.body.style.overflow = '';
                setTimeout(() => map.invalidateSize(), 50);
            };

            btnFullscreen.addEventListener('click', () => {
                const isFull = mapaContainerEl.classList.toggle('fullscreen');
                if (isFull) {
                    btnFullscreen.innerHTML = '<i class="fas fa-compress" aria-hidden="true"></i>';
                    document.body.style.overflow = 'hidden';
                } else {
                    btnFullscreen.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';
                    document.body.style.overflow = '';
                }
                setTimeout(() => map.invalidateSize(), 50);
            });

            // Salir con tecla ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mapaContainerEl.classList.contains('fullscreen')) {
                    exitFullscreen();
                }
            });
        }

        // Geolocalización del usuario y enlace de rutas
        const comoBtn = document.getElementById('btnComoLlegar');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const userLatLng = [pos.coords.latitude, pos.coords.longitude];



                    const userMarker = L.marker(userLatLng, { title: 'Tu ubicación' }).addTo(map);
                    // Se elimina el círculo de precisión alrededor de la ubicación del usuario

                    // Ajustar vista para mostrar ambas ubicaciones
                    const bounds = L.latLngBounds([hotelLocation, userLatLng]);
                    map.fitBounds(bounds, { padding: [30, 30] });

                    // Actualizar el botón de rutas con origen del usuario
                    if (comoBtn) {
                        comoBtn.href = `https://www.google.com/maps/dir/?api=1&origin=${userLatLng[0]},${userLatLng[1]}&destination=${hotelLocation[0]},${hotelLocation[1]}`;
                        comoBtn.textContent = 'Cómo llegar desde mi ubicación';
                    }

                    // Trazar ruta dentro del mapa (Leaflet Routing Machine)
                    if (typeof L.Routing !== 'undefined') {
                        L.Routing.control({
                            waypoints: [
                                L.latLng(userLatLng[0], userLatLng[1]),
                                L.latLng(hotelLocation[0], hotelLocation[1])
                            ],
                            lineOptions: {
                                styles: [{ color: '#2563eb', weight: 5, opacity: 0.8 }]
                            },
                            show: false,
                            addWaypoints: false,
                            routeWhileDragging: false,
                            draggableWaypoints: false,
                            fitSelectedRoutes: true,
                            createMarker: () => null,
                            router: L.Routing.osrmv1({
                                serviceUrl: 'https://router.project-osrm.org/route/v1'
                            })
                        }).addTo(map);
                    }
                },
                (err) => {
                    // Si falla o el usuario no otorga permiso, mantenemos el enlace por defecto
                    console.warn('Geolocalización no disponible:', err);
                    const msgEl = document.getElementById('geoMsg');
                    if (msgEl) {
                        msgEl.style.display = 'inline';
                        msgEl.textContent = 'Para ver la ruta desde tu ubicación, permite el acceso a tu ubicación.';
                    }

                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }

    // Galería de imágenes
    const galeriaLinks = document.querySelectorAll('.product-grid a');
    galeriaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.querySelector('img').src;
            const lightbox = document.createElement('div');
            lightbox.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; justify-content: center; align-items: center; z-index: 1000;">
                    <img src="${imgSrc}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
                </div>
            `;
            document.body.appendChild(lightbox);
            
            lightbox.addEventListener('click', () => {
                lightbox.remove();
            });
        });
    });

    // FormSubmit: mostrar mensaje de confirmación tras redirección
    const params = new URLSearchParams(window.location.search);
    if (params.get('enviado') === '1') {
        const msgEl = document.getElementById('contacto-msg');
        if (msgEl) {
            msgEl.style.display = 'block';
        }
    }

    

});
