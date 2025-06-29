export type Message = {
  body: string;
  recipients: string[];
  scheduledTime?: string;
};

export type GenericLogger = {
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
};
