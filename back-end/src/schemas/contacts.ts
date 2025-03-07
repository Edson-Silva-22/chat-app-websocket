import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true})
export class Contacts {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  })
  userId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  })
  contactId: string;

  @Prop({
    required: false,
  })
  lastMessage?: string;

  @Prop({
    required: false,
  })
  lastMessageTime?: Date;

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts)