'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ImUsers } from 'react-icons/im';

const ErrorCard = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => {
        return (
          <Card className="w-1/2 h-32 p-1">
            <CardHeader className="flex flex-col items-start justify-center space-y-0 pb-2">
              <div className="w-full h-auto flex justify-between items-start">
                <CardTitle className="text-md font-bold">
                  Recent Users
                </CardTitle>
                <ImUsers />
              </div>

              <CardDescription className="text-sm">
                0 users joined this month.
              </CardDescription>
            </CardHeader>
            <CardContent
              className="w-full flex-1 p-1
                 flex  justify-center items-center"
            >
              <p className="text-sm  font-sans">Something went wrong...</p>
              <p
                className="text-sm ml-2 mr-2 underline hover:text-[#8449BF]
                hover:cursor-pointer font-semibold"
                onClick={() => resetErrorBoundary()}
              >
                Retry
              </p>
            </CardContent>
          </Card>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorCard;
