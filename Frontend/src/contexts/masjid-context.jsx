import React, { createContext, useContext, useState, useEffect } from "react";

const MasjidContext = createContext();

export function MasjidProvider({ children }) {
  const [masjids, setMasjids] = useState([]);
  const [currentMasjid, setCurrentMasjid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMasjids = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://masjid-project.onrender.com/api/masjids"
        );

        // Response-ቱ ትክክል መሆኑን ማረጋገጥ (ለምሳሌ 404 ወይም 500 ካልሆነ)
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
          setMasjids(result.data);

          const savedMasjidId = localStorage.getItem("selectedMasjidId");
          const initialMasjid =
            result.data.find((m) => m._id === savedMasjidId) || result.data[0];

          setCurrentMasjid(initialMasjid);
        } else {
          // ዳታው ባዶ ከሆነ Loading ማቆም አለበት
          console.warn("ምንም መስጂድ አልተገኘም (Empty data)");
        }
      } catch (error) {
        console.error("Error fetching masjids:", error);
      } finally {
        // ይህ መስመር ከሁሉም በላይ ወሳኝ ነው!
        // ስህተት ቢፈጠርም ባይፈጠርም Loading መቆሙን ያረጋግጣል
        setIsLoading(false);
      }
    };

    fetchMasjids();
  }, []);

  const changeMasjid = (masjid) => {
    if (!masjid) return;
    setCurrentMasjid(masjid);
    localStorage.setItem("selectedMasjidId", masjid._id);
  };

  return (
    <MasjidContext.Provider
      value={{
        masjids,
        currentMasjid,
        setCurrentMasjid: changeMasjid,
        isLoading,
      }}
    >
      {children}
    </MasjidContext.Provider>
  );
}

export function useMasjid() {
  const context = useContext(MasjidContext);
  if (!context) {
    throw new Error("useMasjid must be used within a MasjidProvider");
  }
  return context;
}
