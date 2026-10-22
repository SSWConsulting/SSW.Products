import React, { useMemo } from "react";

const GoogleStructuredDataScript: React.FC<{ jsonString?: string | null }> = ({ jsonString }) => {
  const parsed = useMemo(() => {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (err) {
      console.error("Failed to parse googleStructuredData:", err);
      return null;
    }
  }, [jsonString]);
  if (!parsed) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(parsed) }}
    />
  );
};

export default GoogleStructuredDataScript;
