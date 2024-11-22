import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, Firestore, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import EhsaanDrawScreen from "../Navbar";
interface SceneData {
  id: string; 
}
 
interface SharedPageProps {
  database: Firestore;
}
 
const SharedPage: React.FC<SharedPageProps> = ({ database }) => {
  const [sharedScenes, setSharedScenes] = useState<SceneData[]>([]);
  const { shareId } = useParams<{ shareId: string }>();
  useEffect(() => {
    const fetchSharedData = async () => {
      if (!shareId) {
        toast.error("No share ID provided.");
        return;
      }
    
      try {
        const sharedDocRef = doc(database, "share", shareId);
        const sharedDocSnap = await getDoc(sharedDocRef);
    
        if (sharedDocSnap.exists()) {
          const { sceneId, userId } = sharedDocSnap.data() as {
            sceneId: string;
            userId: string;
          };
    
          if (!userId) {
            toast.error("GitHub ID is missing in the shared document.");
            return;
          }
    
          // Fetch the scene using the userId and sceneId
          const sceneDocRef = doc(database, "users", `${userId}/scenes`, sceneId);
          const sceneDocSnap = await getDoc(sceneDocRef);
    
          if (sceneDocSnap.exists()) {
            const { scenes1 } = sceneDocSnap.data() as { scenes1: string };
            const parsedScenesData = JSON.parse(scenes1); // Parse the JSON data
            setSharedScenes(parsedScenesData);
          } else {
            toast.error("Scene document not found.");
          }
        } else {
          toast.error("Shared document not found.");
        }
      } catch (error) {
        console.error("Error fetching shared data:", error);
        toast.error("Failed to fetch shared data.");
      }
    };
    fetchSharedData();
  }, [shareId, database]);
  
  return (
    <div>
      <EhsaanDrawScreen scenes={sharedScenes} readOnly={true} />
    </div>
  );
};
 
export default SharedPage;