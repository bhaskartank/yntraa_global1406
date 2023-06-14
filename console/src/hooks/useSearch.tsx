import debounce from "@mui/utils/debounce";
import React, { useState } from "react";

const useSearch = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(event?.target?.value);
  };

  const handleSearch = React.useMemo(() => debounce(handleInputChange, 600), []);

  const handleClearSearch = () => {
    setLocalSearchTerm("");
  };

  return {
    localSearchTerm,
    setLocalSearchTerm,
    handleClearSearch,
    handleSearch,
  };
};

export default useSearch;
