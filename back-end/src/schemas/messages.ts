import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  })
  sender: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  })
  receiver: string

  @Prop({
    required: false,
  })
  text: string

  @Prop({
    required: false,
  })
  file: string

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message)