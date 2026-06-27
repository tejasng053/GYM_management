import mongoose, { Document, Schema, Model } from 'mongoose';

export type NotificationType = 'expiry' | 'absence' | 'birthday' | 'welcome' | 'equipment' | 'payment' | 'stock' | 'general';

export interface INotification extends Document {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
  memberId?: string;
}

const NotificationSchema = new Schema<INotification>({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['expiry', 'absence', 'birthday', 'welcome', 'equipment', 'payment', 'stock', 'general'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, required: true },
  read: { type: Boolean, default: false },
  actionLabel: String,
  actionTarget: String,
  memberId: String,
}, { timestamps: true });

NotificationSchema.index({ id: 1 }, { unique: true });
NotificationSchema.index({ read: 1, timestamp: -1 });
NotificationSchema.index({ memberId: 1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;