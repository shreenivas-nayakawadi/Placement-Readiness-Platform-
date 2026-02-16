import * as React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

function Card({ className = '', ...props }: DivProps) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`.trim()} {...props} />;
}

function CardHeader({ className = '', ...props }: DivProps) {
  return <div className={`flex flex-col gap-1.5 p-6 ${className}`.trim()} {...props} />;
}

function CardTitle({ className = '', ...props }: DivProps) {
  return <h3 className={`font-['Sora'] text-lg font-semibold text-slate-900 ${className}`.trim()} {...props} />;
}

function CardDescription({ className = '', ...props }: DivProps) {
  return <p className={`text-sm text-slate-600 ${className}`.trim()} {...props} />;
}

function CardContent({ className = '', ...props }: DivProps) {
  return <div className={`p-6 pt-0 ${className}`.trim()} {...props} />;
}

function CardFooter({ className = '', ...props }: DivProps) {
  return <div className={`flex items-center p-6 pt-0 ${className}`.trim()} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
