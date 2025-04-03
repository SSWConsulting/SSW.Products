import React from "react";
import { tinaField } from "tinacms/dist/react";
import { curlyBracketFormatter } from "./Hero";

import { RxCross1 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";


const Table = ({ table }: { table: any }) => {
  const regularBoxStyling = "text-white/60 p-4 text-center";
  const primaryBoxStyling =
    " text-white bg-gradient-to-r to-[#141414] via-[#131313] from-[#0e0e0e] p-4 rounded-bl-xl";

  // Helper function to render content with check icon replacement
  const renderContent = (content: any) => {
    if (content === "✅") {
      return (
        <div className="flex justify-center">
          <FaCheck className="text-red-600" />
        </div>
      );
    }
    if (content === "❌") {
      return (
        <div className="flex justify-center">
          <RxCross1 className="text-white/50" />
        </div>
      );
    }
    return content;
  };

  return (
    <div className="mb-10 border-2 border-white/20 rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <tbody className="divide-y divide-white/10">
            <tr>
              <td
                colSpan={5}
                className={`text-white bg-[#141414] p-4 text-center font-semibold rounded-t-xl`}
              >
                {table.title}
              </td>
            </tr>
            {table?.rows?.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className={``}>
                <td
                  className={`${primaryBoxStyling} ${
                    rowIndex === 0 ? "font-bold" : "font-medium"
                  } w-1/4`}
                >
                  {renderContent(row.column1)}
                  {row.column1SubText && (
                    <div className="text-white/50 text-xs mt-1">
                      {row.column1SubText}
                    </div>
                  )}
                </td>
                <td
                  className={`${regularBoxStyling} ${
                    rowIndex === 0 ? "font-bold bg-[#141414]" : "font-medium"
                  }`}
                >
                  {renderContent(row.column2)}
                  {row.column2SubText && (
                    <div className="text-white/50 text-xs mt-1">
                      {row.column2SubText}
                    </div>
                  )}
                </td>
                <td
                  className={`${regularBoxStyling} ${
                    rowIndex === 0 ? "font-bold bg-[#141414]" : "font-medium"
                  } relative`}
                >
                  <div className="absolute inset-0 bg-[#13131394] h-full z-0"></div>
                  <div className="relative z-10 text-white/75">
                    {renderContent(row.column3)}
                    {/* {rowIndex === 0 && row.column3 === "Team" && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-600 text-white justify-center pt-1 font-bold">
                        Popular
                      </span>
                    )} */}
                    {row.column3SubText && (
                      <div className="text-white/50 text-xs mt-1">
                        {row.column3SubText}
                      </div>
                    )}
                  </div>
                </td>
                <td
                  className={`${regularBoxStyling} ${
                    rowIndex === 0 ? "font-bold bg-[#141414]" : "font-medium"
                  }`}
                >
                  {renderContent(row.column4)}
                  {row.column4SubText && (
                    <div className="text-white/50 text-xs mt-1">
                      {row.column4SubText}
                    </div>
                  )}
                </td>
                <td
                  className={`${regularBoxStyling} ${
                    rowIndex === 0 ? "font-bold bg-[#141414]" : "font-medium"
                  }`}
                >
                  {renderContent(row.column5)}
                  {row.column5SubText && (
                    <div className="text-white/50 text-xs mt-1">
                      {row.column5SubText}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {table.footerText && (
              <tr>
                <td
                  colSpan={5}
                  className="bg-black p-4 text-left text-white/50 text-xs rounded-b-xl"
                >
                  {table.footerText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function ComparisonTable({ data }: { data: any }) {
  return (
    <div className="container max-w-7xl mx-auto p-4 mb-14 pt-20 lg:pt-0 lg:mb-4 mt-20 lg:mt-0 md:mt-0 lg:pb-40">
      {data.headline && (
        <h1
          className="text-4xl text-center font-semibold text-white mb-4"
          data-tina-field={tinaField(data, "title")}
        >
          {curlyBracketFormatter(data.headline)}
        </h1>
      )}
      {data.sectionDescription && (
        <div
          className="text-white text-base text-center px-4 mb-8"
          data-tina-field={tinaField(data, "sectionDescription")}
        >
          <p>{curlyBracketFormatter(data.sectionDescription)}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {data.table &&
          data.table.map((tableItem: any, index: number) => (
            <Table key={index} table={tableItem} />
          ))}
      </div>
    </div>
  );
}
