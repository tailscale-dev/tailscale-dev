import { ReactNode } from 'react';

export interface NoteProps {
  children: ReactNode;
}

export const Note = ({ children }: NoteProps) => (
  <div className="mb-1.5 text-base font-medium">{children}</div>
);
