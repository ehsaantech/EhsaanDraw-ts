import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, Firestore } from 'firebase/firestore';
import toast from "react-hot-toast";
import EhsaanDrawScreen from '../Navbar';

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
    if (!shareId) {
      toast.error("No share ID provided.");
      return;
    }

    const fetchSharedData = async () => {
      try {
        const sharedDocRef = doc(database, "share", shareId);
        const sharedDocSnap = await getDoc(sharedDocRef);
        if (sharedDocSnap.exists()) {
          const { scenesData } = sharedDocSnap.data() as { scenesData: SceneData[] };
          setSharedScenes(scenesData);
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
}

export default SharedPage;
