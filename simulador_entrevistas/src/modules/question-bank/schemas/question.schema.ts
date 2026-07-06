import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type QuestionDocument = Question & Document;

//Banco de preguntas curado: semilla/referencia y fallback para la IA.
@Schema({
  collection: 'question_bank',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Question {
  @ApiProperty({
    example: '¿Qué es el event loop de Node.js?',
    description: 'Enunciado de la pregunta',
  })
  @Prop({ type: String, required: true })
  enunciado: string;

  @ApiProperty({
    example: 'technical',
    description: 'Tipo de entrevista (nombre del catálogo interview_types)',
  })
  @Prop({ type: String, required: true })
  interview_type: string;

  @ApiProperty({
    example: 'Node.js',
    description: 'Tecnología asociada (nombre del catálogo technologies)',
  })
  @Prop({ type: String, required: true })
  technology: string;

  @ApiProperty({
    example: 'medium',
    description: 'Dificultad (nombre del catálogo difficulty_levels)',
  })
  @Prop({ type: String, required: true })
  difficulty: string;

  @ApiProperty({
    description: 'Respuesta modelo con la que se puede comparar al candidato',
    required: false,
  })
  @Prop({ type: String, default: null })
  respuesta_modelo?: string;

  @ApiProperty({
    example: ['async', 'runtime'],
    description: 'Etiquetas de la pregunta',
    type: [String],
  })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ example: true, description: 'Si la pregunta está activa' })
  @Prop({ type: Boolean, default: true })
  activo: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
