export interface RSVP {
  email: string;
  timestamp: Date;
}

export interface Verification {
  email: string;
  code: string;
  createdAt: Date;
  verifiedAt?: Date | null;
  verified: boolean;
}
