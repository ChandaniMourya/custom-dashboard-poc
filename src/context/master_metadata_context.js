// MasterMetadataContext.js
import { createContext, useContext, useState, useEffect } from "react";
const MasterMetadataContext = createContext();
 
export function MasterMetadataProvider({ children }) {
  const [masterMetadata, setMasterMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchMaster() {
      try {
        const res = await fetch("/data/definitionsMetaData.json");
        const data = await res.json();
        console.log(data);
        setMasterMetadata(data);
      } catch (err) {
        console.error("Failed to fetch master metadata", err);
      } finally {
        setLoading(false);
      }
    }
 
    fetchMaster();
  }, []);
 
  return (
<MasterMetadataContext.Provider value={{ masterMetadata, loading }}>
      {children}
</MasterMetadataContext.Provider>
  );
}
 
export function useMasterMetadata() {
  return useContext(MasterMetadataContext);
}