import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import type { PDFDocumentProxy } from 'pdfjs-dist';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  return (
    <div className="w-full  h-[300px] md:h-[500px] overflow-y-auto flex justify-start md:justify-center items-start">
      <Document
        loading={() => (
          <div className="w-full h-[500px]  flex justify-center items-center font-bold">
            <p>Loading...</p>
          </div>
        )}
        file={{ url }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {/* {Array.from(new Array(numPages), (el, index) => (
            ))} */}
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PdfViewer;
