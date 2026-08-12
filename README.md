# 🐾 Killa Vet — Aplicación Móvil React Native / Expo

Aplicación móvil para la gestión de pacientes de una clínica veterinaria, desarrollada con React Native y Expo. Implementa autenticación con Firebase, persistencia local con SQLite, sincronización en la nube con Firestore y consumo de API REST.

---

## 📋 Requisitos previos

- Node.js >= 18
- npm >= 9
- Expo Go instalado en el dispositivo móvil ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Cuenta de Firebase con proyecto configurado

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/KillaVet-react-native.git
cd KillaVet-react-native

# 2. Instalar dependencias
npm install

# 3. Configurar Firebase (ver sección siguiente)

# 4. Iniciar la aplicación
npx expo start
```

---

## 🔥 Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication → Correo electrónico/contraseña**
3. Crear base de datos **Firestore** en modo de prueba
4. Registrar una app Web y copiar la configuración

Editar `src/config/firebase.ts` y reemplazar los valores:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};
```

---

## ▶️ Cómo ejecutar el proyecto

```bash
npx expo start
```

Escanear el código QR con **Expo Go** en el celular (misma red WiFi).

---

## 🔐 Cómo probar el Login y Registro

1. Abrir la app → pantalla **Landing**
2. Tocar **"Crear cuenta"** → ingresar correo y contraseña (mínimo 6 caracteres)
3. Al registrarse, la app navega automáticamente a **Home**
4. Verificar en Firebase Console → **Authentication → Usuarios** que el usuario fue creado
5. Para probar login: cerrar sesión desde **Perfil** → volver a iniciar sesión
6. Las pantallas principales están protegidas — sin sesión solo se puede ver Landing/Login/Registro

---

## 🗂️ Cómo probar el CRUD de pacientes

| Operación | Cómo hacerlo |
|-----------|-------------|
| **Crear** | Botón **"Registrar nuevo paciente"** en Home |
| **Listar** | Pantalla Home muestra todos los pacientes con filtros y búsqueda |
| **Ver detalle** | Tocar cualquier paciente en la lista |
| **Editar** | Desde detalle → botón ✏️ → modificar campos → Guardar cambios |
| **Eliminar** | Desde detalle → botón 🗑️ → confirmar / o mantener presionada la tarjeta |

---

## 💾 Cómo probar SQLite

1. Registrar uno o más pacientes
2. **Cerrar completamente** la aplicación (sacarla del multitarea)
3. Volver a abrirla e iniciar sesión
4. Los pacientes siguen apareciendo → **datos persistidos en SQLite local**

Funciona sin conexión a internet. La base de datos se almacena en `killavet.db` con `expo-sqlite`.

---

## 🌐 Cómo probar el consumo de API REST

- En **Home**, debajo de las estadísticas, aparece la sección **"🐕 Razas disponibles"**
- Consume la [Dog CEO API](https://dog.ceo/api/breeds/list/all) automáticamente al cargar
- Muestra **indicador de carga** mientras obtiene los datos
- Muestra **mensaje de error** si la petición falla
- Muestra las razas como chips deslizables horizontalmente

---

## ☁️ Cómo probar Firestore

1. Registrar un paciente en la app
2. Abrir [Firebase Console](https://console.firebase.google.com) → **Firestore Database**
3. Verificar que existe la colección `patients` con los documentos creados
4. Cada documento incluye el `userId` del usuario autenticado
5. Editar o eliminar un paciente en la app → el cambio se refleja en Firestore

---

## 📱 Ejecución en dispositivo / Generación de APK

**Dispositivo físico (recomendado):**
```bash
npx expo start
# Escanear QR con Expo Go
```

**Emulador Android (requiere Android Studio):**
```bash
npx expo start --android
```

**Generar APK con EAS Build:**
```bash
npm install -g eas-cli
eas build --platform android --profile preview
```

---

## 🏗️ Estructura del proyecto

```
src/
├── config/
│   └── firebase.ts               # Configuración Firebase
├── context/
│   ├── AuthContext.tsx            # Estado de autenticación Firebase
│   └── PatientContext.tsx         # CRUD (SQLite + Firestore)
├── navigation/
│   └── AppNavigator.tsx           # Navegación con protección de rutas
├── screens/
│   ├── LandingScreen.tsx          # Pantalla de bienvenida
│   ├── LoginScreen.tsx            # Inicio de sesión Firebase
│   ├── RegisterScreen.tsx         # Registro de usuario Firebase
│   ├── HomeScreen.tsx             # Lista + API REST
│   ├── RegisterPatientScreen.tsx  # Crear paciente
│   ├── EditPatientScreen.tsx      # Editar paciente
│   ├── PatientDetailScreen.tsx    # Detalle + cambio de estado
│   └── ProfileScreen.tsx          # Perfil + cerrar sesión
├── services/
│   ├── database.ts                # Operaciones SQLite
│   └── api.ts                     # Consumo API REST (Dog CEO)
├── components/
│   ├── Button.tsx                 # Botón reutilizable
│   ├── InputField.tsx             # Campo de entrada reutilizable
│   ├── PatientCard.tsx            # Tarjeta de paciente
│   └── SpeciesSelector.tsx        # Selector de especie
├── theme/
│   └── colors.ts                  # Paleta de colores y espaciado
└── types/
    └── index.ts                   # Tipos TypeScript globales
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|-----------|-----|
| React Native + Expo SDK 54 | Framework móvil |
| TypeScript | Tipado estático |
| React Navigation v7 | Navegación entre pantallas |
| Firebase Authentication | Login / Registro / Logout |
| Firebase Firestore | Base de datos en la nube |
| expo-sqlite | Persistencia local SQLite |
| Dog CEO API | Consumo de API REST |
| React Context + Hooks | Manejo de estado global |

---

## 👥 Integrantes del grupo

- Jesús Colina
- Gissel Peña
