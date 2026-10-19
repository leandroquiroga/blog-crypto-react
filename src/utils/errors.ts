import { ApiError } from '@/services/http/client';

const FIREBASE_AUTH_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'El email ingresado no es valido.',
  'auth/weak-password': 'La contrasena es demasiado debil (minimo 6 caracteres).',
  'auth/email-already-in-use': 'Ese email ya esta registrado.',
  'auth/user-not-found': 'No existe una cuenta con ese email.',
  'auth/wrong-password': 'La contrasena es incorrecta.',
  'auth/invalid-credential': 'Email o contrasena incorrectos.',
  'auth/missing-password': 'Debes ingresar una contrasena.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Espera unos minutos.',
  'auth/network-request-failed': 'Sin conexion. Revisa tu red e intenta nuevamente.',
  'auth/popup-closed-by-user': 'Cancelaste el inicio de sesion con Google.',
  'auth/popup-blocked': 'El navegador bloqueo la ventana de Google. Habilita los popups.',
  'auth/account-exists-with-different-credential':
    'Ese email ya esta registrado con otro metodo de inicio de sesion.',
  'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesion para continuar.',
};

const FIRESTORE_MESSAGES: Record<string, string> = {
  'permission-denied':
    'No tenes permisos para acceder a la base de datos. Revisa las reglas de Firestore.',
  unauthenticated: 'Tu sesion expiro. Volve a iniciar sesion.',
  unavailable: 'No se pudo conectar con la base de datos. Revisa tu conexion.',
  'not-found': 'No se encontro la base de datos del proyecto.',
  'failed-precondition': 'La base de datos no esta disponible o su configuracion es incorrecta.',
  'resource-exhausted': 'Se alcanzo el limite de uso de la base de datos. Intenta mas tarde.',
  'deadline-exceeded': 'La base de datos tardo demasiado en responder.',
  'invalid-argument': 'Los datos enviados no son validos.',
  aborted: 'La operacion fue cancelada. Intenta nuevamente.',
  'already-exists': 'El recurso ya existe.',
};

const FIREBASE_MESSAGES: Record<string, string> = {
  ...FIREBASE_AUTH_MESSAGES,
  ...FIRESTORE_MESSAGES,
};

interface ErrorWithCode {
  code: string;
}

function hasErrorCode(error: unknown): error is ErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

function normalizeCode(code: string): string {
  return code.startsWith('firestore/') ? code.slice('firestore/'.length) : code;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;

  if (hasErrorCode(error)) {
    const mapped = FIREBASE_MESSAGES[normalizeCode(error.code)];
    if (mapped) return mapped;

    if (import.meta.env.DEV) {
      return `Ocurrio un error inesperado (codigo: ${error.code}). Intenta nuevamente.`;
    }
  }

  if (error instanceof Error && error.message) return error.message;

  return 'Ocurrio un error inesperado. Intenta nuevamente.';
}

export function reportError(scope: string, error: unknown): void {
  console.error(`[${scope}]`, error);
}
