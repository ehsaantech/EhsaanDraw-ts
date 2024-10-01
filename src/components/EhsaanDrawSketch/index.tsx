import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import EhsaanDrawScreen from "../Navbar";
import { database } from "../../../firebaseConfig";
import { useGithub } from "../../githubContext";
import React from "react";

interface SceneData {
  id: string;
  scenes1: string; // Adjust according to your actual data structure
}

const SketchingPad: React.FC = () => {
  const [updatedScenes, setUpdatedScenes] = useState<SceneData[]>([]);
  const { id } = useParams<{ id: string }>();
  const { githubId } = useGithub();
  const [collectionUrl, setCollectionUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false); 

  useEffect(() => {
    const getData = async () => {
      try {
        const appdataRef = collection(database, "users", `${githubId}/scenes`);
        setCollectionUrl(appdataRef.path);
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
    getData();
    // eslint-disable-next-line
  }, [githubId,id]);

  const shareScenesData = async () => {
    try {
      if (!githubId) {
        throw new Error("User ID is not available.");
      }
      if (!updatedScenes || updatedScenes.length === 0) {
        throw new Error("Scenes data is empty or not initialized.");
      }

      const appdataRef = collection(database, "share");
      const shareDoc = {
        userId: githubId,
        scenesData: updatedScenes,
        sceneId: id, 
      };

      const docRef = await addDoc(appdataRef, shareDoc);
      const shareableLink = `${window.location.origin}/shared/${docRef.id}`;
      

      await navigator.clipboard.writeText(shareableLink);
      toast.success("Shareable link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing data:", error);
      toast.error("Failed to share data.");
    }
  };

  const updateData = async (elements: any[]) => { // Adjust the type as necessary
    if (!id) {
      toast.error("Please select a document or create a new one.");
      return false;
    }
    setIsSaving(true); 
    try {
      const updateValue = doc(database, "users", `${githubId}/scenes`, id);
      await updateDoc(updateValue, { scenes1: JSON.stringify(elements) });
      setUpdatedScenes(elements);
    } catch (error) {
      console.error("Error saving sketch:", error);
      toast.error("Failed to save sketch.");
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
      />
    </div>
  );
}

export default SketchingPad;
