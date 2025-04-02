export type Message = {
  body: string;
  recipients: string[];
};

export type GenericLogger = {
  error: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
};
