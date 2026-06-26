# FlyAway-Frontend_EmilyChacon

Emily Alessandra Chacón Ttito - 202510367

## Aclaraciones
Estimado profesor, tuve que realizar algunos cambios en el backend porque no podía conectarse con normalidad el frontend con el backend por alguna razón. Los cambios realizados son los siguientes:

**FlightController:** Se agregó @CrossOrigin(origins = "http://localhost:5173")

**UserController:** Se agregó @CrossOrigin(origins = "http://localhost:5173")

**AuthController:** Se agregó @CrossOrigin(origins = "http://localhost:5173")

Los CrossOrigins se deben modificar dependiendo de en que puerto se esté ejecutando el frontend del usuario.

**application.properties:** Se agregó spring.h2.console.enabled=true para asegurarnos de que permita entrar a h2.console (al principio no dejaba utilizarlo)


**Configuration:**

Se modificó el funcionamiento de SecurityFilterChain para que permita acceder a los datos.
```
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .cors(org.springframework.security.config.Customizer.withDefaults())
                .csrf(csrf -> csrf.ignoringRequestMatchers(PathRequest.toH2Console()).disable())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PathRequest.toH2Console()).permitAll()
                        .requestMatchers("/users/register", "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/flights", "/flights/search", "/flights/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/flights/create", "/flights/create-many").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
```
Los archivos que mando son del frontend y los del backend por si acaso. Se recomienda ejecutar primero el del backend con 

```./mvnw spring-boot:run```

o simplemente hacer click en el botón Run.

Luego implementar y ejecutar el frontend con

```npm run dev```

----

La tabla de los aspectos que se completaron (si los considere correctamente) son los siguientes:


| Funcionalidad | Must Have | Nice to Have |
|---------------|-----------|--------------|
| Registro | Si | — |
| Login | Si | Si |
| Búsqueda de vuelos | Si | Si |
| Reservar vuelo | Si | Si |
| Mis reservas | — | Si |
| Cerrar sesión & navegación | Si | — |

