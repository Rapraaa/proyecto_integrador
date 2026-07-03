import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AiLogDocument = AiLog & Document;

//Log de cada interacción con el proveedor de IA: auditoría y optimización
//(doc sección 3: el admin optimiza consultas para evitar saturación).
@Schema({
  collection: 'ai_logs',
  timestamps: { createdAt: 'created_at', updatedAt: false },
})
export class AiLog {
  @Prop({ type: String, default: null })
  user_id?: string;

  @Prop({ type: String, default: null })
  interview_id?: string;

  @Prop({ type: String, required: true })
  prompt: string;

  @Prop({ type: String, required: true })
  response: string;

  @Prop({ type: String, required: true })
  model: string;

  @Prop({ type: Number, default: null })
  tokens?: number;

  @Prop({ type: Number, default: null })
  latency_ms?: number;
}

export const AiLogSchema = SchemaFactory.createForClass(AiLog);
