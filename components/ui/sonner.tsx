import * as React from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = 'light';

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600" />,
        info: <InfoIcon className="size-4 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600" />,
        error: <OctagonXIcon className="size-4 text-rose-600" />,
        loading: <Loader2Icon className="size-4 animate-spin text-purple-600" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-900 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg rounded-2xl p-4 flex gap-3 border font-sans text-sm',
          description: 'group-[.toast]:text-zinc-500 text-xs',
          success:
            'group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-950 group-[.toaster]:!border-emerald-200',
          error:
            'group-[.toaster]:!bg-rose-50 group-[.toaster]:!text-rose-950 group-[.toaster]:!border-rose-200',
          info: 'group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-950 group-[.toaster]:!border-blue-200',
          warning:
            'group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-950 group-[.toaster]:!border-amber-200',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
