'use client';
import React, { createContext, ReactNode, useState } from 'react';

interface ViewportContextInterface {
  viewport: any;
  setViewport: (newViewport: any) => void;
}

const initialViewport = {
  latitude: 41.5,
  longitude: -74,
  zoom: 9,
};

const initialState: ViewportContextInterface = {
  viewport: initialViewport,
  setViewport: () => {},
};

export const ViewportContext =
  createContext<ViewportContextInterface>(initialState);

interface ViewportProviderProps {
  /**
   * The children components of the provider
   */
  children: ReactNode;
}

export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const [viewport, setViewport] = useState(initialViewport);

  return (
    <ViewportContext.Provider
      value={{
        viewport,
        setViewport,
      }}
    >
      {children}
    </ViewportContext.Provider>
  );
};
