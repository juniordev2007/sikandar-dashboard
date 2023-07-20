import { createContext, useEffect, useState } from "react";
import { db } from "@/utils/firebase";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [vendors, setVendors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [generatedLinks, setGeneratedLinks] = useState([]);

  const fetchVendorsData = async () => {
    try {
      const vendorsData = await db.collection("vendors").get();
      setVendors(vendorsData.docs.map((doc) => ({ ...doc.data() })));
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchCampaignsData = async () => {
    try {
      const campaignsData = await db.collection("campaigns").get();
      setCampaigns(campaignsData.docs.map((doc) => ({ ...doc.data() })));
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchSubcategoriesData = async () => {
    try {
      const subcategoriesData = await db.collection("subcategories").get();
      setSubcategories(subcategoriesData.docs.map((doc) => ({ ...doc.data() })));
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchGeneratedLinks = async () => {
    try {
      const generatedLinksData = await db.collection("generatedLinks").get();
      setGeneratedLinks(generatedLinksData.docs.map((doc) => ({ ...doc.data() })));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchVendorsData(), fetchCampaignsData(), fetchSubcategoriesData(), fetchGeneratedLinks()]);
    };
    fetchData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        vendors,
        campaigns,
        subcategories,
        fetchVendorsData,
        fetchCampaignsData,
        fetchSubcategoriesData,
        generatedLinks,
        fetchGeneratedLinks,
      }}>
      {children}
    </AppContext.Provider>
  );
}
