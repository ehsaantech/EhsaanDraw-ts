import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EhsaanDrawScreen from "../Navbar";
import { database } from "../../../firebaseConfig";
import { useGithub } from "../../githubContext";
 
interface SceneData {
  id: string;
  scenes1: string; 
}
 
const SketchingPad: React.FC = () => {
  const [updatedScenes, setUpdatedScenes] = useState<SceneData[]>([]);
  const { id } = useParams<{ id: string }>();
  const { githubId } = useGithub();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);
 
  useEffect(() => {
    const getData = async () => {
      try {
        const appdataRef = collection(database, "users", `${githubId}/scenes`);
        const docSnap = await getDocs(appdataRef);
        const scenesData: SceneData[] = docSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as SceneData[];
 
        const filteredScenes = scenesData.find((scene) => scene.id === id);
        if (filteredScenes) {
          setUpdatedScenes(JSON.parse(filteredScenes.scenes1));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData().then();
  }, [githubId, id]);
 
  const shareScenesData = async () => {
    setIsSharing(true);
    try {
      if (!githubId) {
        toast.error("GitHub ID is not available.");
        return;
      }
  
      if (!id) {
        toast.error("Scene ID is not available.");
        return;
      }
  
      const appdataRef = collection(database, "share");
  
      const querySnapshot = await getDocs(appdataRef);
      const existingDoc = querySnapshot.docs.find(
        (doc) => doc.data().userId === githubId && doc.data().sceneId === id
      );
  
      let shareableLink: string;
  
      if (existingDoc) {
        shareableLink = `${window.location.origin}/shared/${existingDoc.id}`;
      } else {
        const shareDoc = {
          userId: githubId,
          sceneId: id,
        };
  
        const docRef = await addDoc(appdataRef, shareDoc);
        shareableLink = `${window.location.origin}/shared/${docRef.id}`;
      }
  
      await navigator.clipboard.writeText(shareableLink);
      toast.success("Shareable link copied to clipboard!");
      setIsSharing(false);
    } catch (error) {
      console.error("Error sharing data:", error);
      toast.error("Failed to share data.");
    }
  };
 
  const updateData = async (elements: any[]): Promise<boolean> => {
    if (!id) {
      toast.error("Please select a document or create a new one.");
      return false;
    }
 
    setIsSaving(true);
    try {
      const updateValue = doc(database, "users", `${githubId}/scenes`, id);
      await updateDoc(updateValue, { scenes1: JSON.stringify(elements) });
 
      setUpdatedScenes(elements);
 
      return true;
    } catch (error) {
      console.error("Error saving sketch:", error);
      toast.error("Failed to save sketch.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };
 
  return (
    <div>
      <EhsaanDrawScreen
        updateData={updateData}
        scenes={updatedScenes}
        shareScenesData={shareScenesData}
        isSaving={isSaving}
        isSharing={isSharing}
      />
    </div>
  );
};
 
export default SketchingPad;