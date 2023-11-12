"use client";
import React, { useEffect, useState } from "react";
import Login from "./Components/Login";
import { useRouter } from "next/navigation";
import CollectionManager from "./Components/CMS/CollectionManager";

interface Site {
  id: string;
}

const MainPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get authorization, if already authorized then set setPage to 1
      const auth = localStorage.getItem("devflow_token");

      const getSiteInfo = async () => {
        const siteInfo = await webflow.getSiteInfo();
        const siteId = siteInfo.siteId;
        setSelectedSite({ id: siteId });
      };
      setPage(auth ? 1 : 0);
      setToken(auth || "");
      getSiteInfo();
    }
  }, []);

  // This function determines which content appears on the page
  switch (page) {
    case 0:
      return <Login setPage={setPage} token={token} setToken={setToken} />;
    case 1:
      return <CollectionManager token={token} />;
    case 3:
      return <div>Hello There</div>;
  }
};

export default MainPage;
