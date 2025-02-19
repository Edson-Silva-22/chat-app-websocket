import { Prop, Schema } from "@nestjs/mongoose";
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

  @Prop()
  lastMessage: string;

  @Prop()
  lastMessageTime: Date;
}