# Killa Vet

App móvil para registrar y gestionar pacientes de una clínica veterinaria. Hecha con React Native y Expo.

## Cómo correrla

Primero instalar dependencias:

```bash
npm install
```

Luego iniciar:

```bash
npm start
```

Se abre una ventana en el navegador con un QR. Escanearlo con la app **Expo Go** desde el celular (disponible en Play Store y App Store). El celular y la PC tienen que estar en la misma red wifi.

Si se quiere correr en emulador Android:

```bash
npm run android
```

## Credenciales de acceso veterinario

Para entrar al panel del veterinario usar:

- Usuario: `vet`
- Contraseña: `killa123`

## Pantallas

- **Inicio** — presentación de la clínica con opciones para agendar cita o ingresar como veterinario
- **Login** — acceso para el veterinario con validación de campos
- **Registrar paciente** — formulario con datos de la mascota y del dueño
- **Panel veterinario** — lista de todos los pacientes registrados
- **Detalle del paciente** — ficha completa con opción de eliminar

## Tecnologías usadas

- React Native con Expo
- TypeScript
- React Navigation (stack)
- AsyncStorage
- Context API

## Estructura

```
src/
├── screens/
│   ├── LandingScreen.tsx
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── RegisterPatientScreen.tsx
│   └── PatientDetailScreen.tsx
├── components/
│   ├── InputField.tsx
│   ├── Button.tsx
│   ├── PatientCard.tsx
│   └── SpeciesSelector.tsx
├── context/
│   └── PatientContext.tsx
├── navigation/
│   └── AppNavigator.tsx
└── theme/
    └── colors.ts
```
