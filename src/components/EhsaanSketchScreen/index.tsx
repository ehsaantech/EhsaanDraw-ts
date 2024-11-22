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
import { logEvent } from 'firebase/analytics';
import { analytics } from "../../../firebaseConfig";

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
  const [startTime, setStartTime] = useState<number | null>(null);

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

  useEffect(() => {
    const enterTime = Date.now();
    setStartTime(enterTime);

    console.log("User entered sketch pad at:", new Date(enterTime).toISOString());

    return () => {
      const leaveTime = Date.now();
      if (startTime) {
        const durationInMinutes = (leaveTime - startTime) / 60000; // Time in minutes
        console.log(`User spent ${durationInMinutes.toFixed(2)} minutes on sketch pad.`);

        // Log the event to Firebase Analytics
        logEvent(analytics, 'Duration on SketchBoard', {
          duration_minutes: durationInMinutes.toFixed(2), // Rounded to 2 decimal places
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(leaveTime).toISOString(),
        });
      }
    };
  }, [startTime]);
 
  const shareScenesData = async () => {
    setIsSharing(true);
    logEvent(analytics,"Share Data Analytics")
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
 
  const updateData = async (elements): Promise<boolean> => {
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