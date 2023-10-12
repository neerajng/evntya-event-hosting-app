import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './ErrorPage';

export const ReactErrorBoundary = (props) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorPage}
      onError={(error, errorInfo) => {
        // log the error
        // console.log('Error caught!');
        // console.error(error);
        // console.error(errorInfo);
        // record the error in an APM tool...
      }}
      onReset={() => {
        // reloading the page to restore the initial state
        // of the current page
        // console.log("reloading the page...");
        window.location.reload();

        // other reset logic...
    }}
>
      {props.children}
    </ErrorBoundary>
  );
};
