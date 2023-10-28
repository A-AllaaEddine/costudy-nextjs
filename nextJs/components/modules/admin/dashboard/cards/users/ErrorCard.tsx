'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ImUsers } from 'react-icons/im';

const ErrorCard = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => {
        return (
          <Card className="w-1/2 h-32 p-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold font-sans">
                Total Users
              </CardTitle>
              <ImUsers />
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
