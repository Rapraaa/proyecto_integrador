import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type InterviewDocument = Interview & Document;

@Schema({ _id: false })
export class InterviewConfig {
  @ApiProperty({
    example: 'technical',
    description: 'Tipo de entrevista a simular',
    type: String,
  })
  @Prop({ type: String, required: true })
  interview_type: string;

  @ApiProperty({
    example: 'backend',
    description: 'Rol objetivo de la entrevista',
    type: String,
  })
  @Prop({ type: String, required: true })
  target_role: string;

  @ApiProperty({
    example: 'Senior',
    description: 'Seniority objetivo de la entrevista',
    type: String,
  })
  @Prop({ type: String, required: true })
  seniority: string;

  @ApiProperty({
    example: ['Node.js', 'Express', 'MongoDB'],
    description: 'Tecnologías objetivo de la entrevista',
    type: [String],
  })
  @Prop({ type: [String], required: true })
  technologies: string[];
}

@Schema({ _id: false })
export class ChatMessage {
  @ApiProperty({
    example: 1,
    description: 'Número de secuencia del mensaje',
    type: Number,
  })
  @Prop({ type: Number, required: true })
  sequence: number;

  @ApiProperty({
    example: 'ai',
    description: 'Remitente del mensaje',
    type: String,
  })
  @Prop({ type: String, enum: ['ai', 'user'], required: true })
  sender: string;

  @ApiProperty({
    example: 'Hola, ¿cómo estás?',
    description: 'Contenido del mensaje',
    type: String,
  })
  @Prop({ type: String, required: true })
  content: string;

  @ApiProperty({
    description: 'Código enviado',
    type: String,
  })
  @Prop({ type: String, default: null })
  code_snippet?: string;

  @ApiProperty({
    description: 'Fecha y hora del mensaje',
    type: Date,
  })
  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

@Schema({ _id: false })
export class InterviewEvaluation {
  @ApiProperty({
    description: 'Puntuación del evaluador',
    type: Number,
  })
  @Prop({ type: Number })
  score?: number;

  @ApiProperty({
    description: 'Comentario general del evaluador',
    type: String,
  })
  @Prop({ type: String })
  general_feedback?: string;

  @ApiProperty({
    description: 'Fortalezas del evaluador',
    type: [String],
  })
  @Prop({ type: [String] })
  strengths?: string[];

  @ApiProperty({
    description: 'Debilidades del evaluador',
    type: [String],
  })
  @Prop({ type: [String] })
  weaknesses?: string[];

  @ApiProperty({
    description: 'Tips de mejora del evaluador',
    type: [String],
  })
  @Prop({ type: [String] })
  improvement_tips?: string[];
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Interview {
  @ApiProperty({
    description: 'ID del usuario',
    type: String,
  })
  @Prop({ type: String, required: true })
  user_id: string;

  @ApiProperty({
    description: 'Configuración de la entrevista',
    type: InterviewConfig,
  })
  @Prop({ type: InterviewConfig, required: true })
  config: InterviewConfig;

  @ApiProperty({
    description: 'Estado de la entrevista',
    type: String,
  })
  @Prop({
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress',
  })
  status: string;

  @ApiProperty({
    description: 'Historial de chat',
    type: [ChatMessage],
  })
  @Prop({ type: [ChatMessage], default: [] })
  chat_history: ChatMessage[];

  @ApiProperty({
    description: 'Evaluación de la entrevista',
    type: InterviewEvaluation,
  })
  @Prop({ type: InterviewEvaluation })
  evaluation?: InterviewEvaluation;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
