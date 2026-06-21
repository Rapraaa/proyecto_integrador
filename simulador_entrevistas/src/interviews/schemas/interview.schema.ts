import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InterviewDocument = Interview & Document;

@Schema({ timestamps: true })
export class Interview {
  @Prop({ required: true })
  candidateId: string;

  @Prop({ required: true })
  jobRole: string;

  @Prop({ type: MongooseSchema.Types.Mixed, default: [] })
  aiConversation: any[];

  @Prop()
  score?: number;

  @Prop()
  feedback?: string;

  @Prop({ default: 'pending' })
  status: string;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
