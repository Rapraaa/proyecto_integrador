export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT = 'text',
}

export const TIPOS_DE_PREGUNTA = Object.values(QuestionType);

export function esPreguntaDeOpciones(tipo: string): boolean {
  return (
    tipo === QuestionType.SINGLE_CHOICE || tipo === QuestionType.MULTIPLE_CHOICE
  );
}
