import { Product } from '@prisma/client';
import { ChangeEvent } from 'react';
import { UploadButton } from '@/utils/uploadthing';

import '@uploadthing/react/styles.css';
import Image from 'next/image';
import { UploadFileResponse } from 'uploadthing/client';

const Product = ({
  product,
  handleProductChange,
  handleDeleteProduct,
  handleUploadComplete,
}: {
  product: Product;
  handleProductChange: (
    e: ChangeEvent<HTMLInputElement>,
    field: string,
    id: string
  ) => void;
  handleDeleteProduct: (productId: string) => void;
  handleUploadComplete: (
    res: UploadFileResponse[] | undefined,
    id: string
  ) => void;
}) => {
  return (
    <div key={product.id}>
      <div className="grid grid-cols-10 gap-x-2">
        <div className="col-span-2">
          <label
            htmlFor={`name-${product.id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              value={product.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleProductChange(e, 'name', product.id)
              }
              type="text"
              name="name"
              id={`name-${product.id}`}
              autoComplete="given-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-3">
          <label
            htmlFor={`about-${product.id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </label>
          <div className="mt-2">
            <input
              value={product.about}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleProductChange(e, 'about', product.id)
              }
              type="text"
              name="about"
              id={`about-${product.id}`}
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-1">
          <label
            htmlFor={`price-${product.id}`}
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Price
          </label>
          <div className="mt-2">
            <input
              value={product.price}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleProductChange(e, 'price', product.id)
              }
              type="number"
              name="price"
              id={`price-${product.id}`}
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-3 flex">
          {product.image ? (
            <Image
              src={product.image}
              width={100}
              height={100}
              alt={product.name}
              style={{ objectFit: 'contain' }}
            />
          ) : null}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              handleUploadComplete(res, product.id);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
            }}
          />
        </div>
        <div className="col-span-1 flex justify-center">
          <button onClick={() => handleDeleteProduct(product.id)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 fill-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      {product.analysis ? (
        <div>
          <div className="text-slate-800">
            Inferred type: {product.analysis.type}
          </div>
          <div className="text-slate-800">
            Suggested recipe: {product.analysis.recipe}
          </div>
          <div className="text-slate-800">
            Suggested price per pound: {product.analysis.price}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Product;
