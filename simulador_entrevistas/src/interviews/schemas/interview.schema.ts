import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InterviewDocument = Interview & Document;

@Schema({ _id: false })
export class InterviewConfig {
  @Prop({ type: String, required: true })
  interview_type: string;

  @Prop({ type: String, required: true })
  target_role: string;

  @Prop({ type: String, required: true })
  seniority: string;

  @Prop({ type: [String], required: true })
  technologies: string[];
}

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ type: Number, required: true })
  sequence: number;

  @Prop({ type: String, enum: ['ai', 'user'], required: true })
  sender: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, default: null })
  code_snippet?: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

@Schema({ _id: false })
export class InterviewEvaluation {
  @Prop({ type: Number })
  score?: number;

  @Prop({ type: String })
  general_feedback?: string;

  @Prop({ type: [String] })
  strengths?: string[];

  @Prop({ type: [String] })
  weaknesses?: string[];

  @Prop({ type: [String] })
  improvement_tips?: string[];
}

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: false } })
export class Interview {
  @Prop({ type: String, required: true })
  user_id: string;

  @Prop({ type: InterviewConfig, required: true })
  config: InterviewConfig;

  @Prop({ type: String, enum: ['in_progress', 'completed'], default: 'in_progress' })
  status: string;

  @Prop({ type: [ChatMessage], default: [] })
  chat_history: ChatMessage[];

  @Prop({ type: InterviewEvaluation })
  evaluation?: InterviewEvaluation;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
