import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, Firestore, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import EhsaanDrawScreen from "../Navbar";

interface SceneData {
  id: string; // Adjust properties as per your actual SceneData structure
}

interface SharedPageProps {
  database: Firestore;
}

const SharedPage: React.FC<SharedPageProps> = ({ database }) => {
  const [sharedScenes, setSharedScenes] = useState<SceneData[]>([]);
  const { shareId } = useParams<{ shareId: string }>();

  useEffect(() => {
    // Function to recursively parse any stringifies arrays back into arrays
    const parseData = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map((item) =>
          typeof item === "string" && item.startsWith("[")
            ? JSON.parse(item)
            : parseData(item),
        );
      } else if (obj && typeof obj === "object") {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            typeof value === "string" && value.startsWith("[")
              ? JSON.parse(value)
              : parseData(value),
          ]),
        );
      }
      return obj;
    };

    const fetchSharedData = async () => {
      if (!shareId) {
        toast.error("No share ID provided.");
        return;
      }

      try {
        const sharedDocRef = doc(database, "share", shareId);
        const sharedDocSnap = await getDoc(sharedDocRef);
        if (sharedDocSnap.exists()) {
          // Get the scenesData from the document
          const { scenesData } = sharedDocSnap.data() as {
            scenesData: SceneData[];
          };

          // Parse any stringifies arrays back into their original form
          const parsedScenesData = parseData(scenesData);

          // Set the parsed data
          setSharedScenes(parsedScenesData);
        } else {
          toast.error("Shared document not found.");
        }
      } catch (error) {
        console.error("Error fetching shared data:", error);
        toast.error("Failed to fetch shared data.");
      }
    };

    fetchSharedData().then();
  }, [shareId, database]);

  return (
    <div>
      <EhsaanDrawScreen scenes={sharedScenes} readOnly={true} />
    </div>
  );
};

export default SharedPage;
