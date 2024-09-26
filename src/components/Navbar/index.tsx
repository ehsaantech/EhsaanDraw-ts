import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Excalidraw, THEME } from "@excalidraw/excalidraw";
import { Share2, ArrowLeft, Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../themeContext"; 
import './index.css';  // Import the CSS file

interface EhsaanDrawScreenProps {
  updateData?: (elements: any[]) => void; 
  scenes: any[];
  shareScenesData?: () => void; 
  readOnly?: boolean;
  isSaving?: boolean;
}

const EhsaanDrawScreen: React.FC<EhsaanDrawScreenProps> = ({
  updateData,
  scenes,
  shareScenesData,
  readOnly = false,
  isSaving,
}) => {
    const { theme, toggleTheme } = useContext(ThemeContext); 
    const [excalidrawAPI, setExcalidrawAPI] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (excalidrawAPI) {
        excalidrawAPI.updateScene({ elements: scenes });
        // Ensure to update the theme to a valid THEME type
        excalidrawAPI.updateScene({ appState: { theme } }); 
      }
    }, [scenes, excalidrawAPI, theme]);

  const handleSave = () => {
    if (excalidrawAPI) {
      updateData(excalidrawAPI.getSceneElements());
      toast.success("Sketch saved successfully");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div style={{ height: "100vh" }}>
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          appState: { theme: theme === THEME.LIGHT ? THEME.LIGHT : THEME.DARK }, // Ensure correct theme assignment
          elements: scenes,
        }}
        renderTopRightUI={() => (
          <>
            {!readOnly && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", gap: "10px" }}>
                <button 
                  className={`button ${theme === THEME.LIGHT ? "button-light" : "button-dark"}`} 
                  onClick={handleBack}
                >
                  <ArrowLeft />
                </button>

                <button 
                  className={`button ${theme === THEME.LIGHT ? "button-light" : "button-dark"}`} 
                  onClick={shareScenesData}
                >
                  <Share2 />
                </button>

                <button 
                  className={`button save-button ${theme === THEME.LIGHT ? "save-button-light" : "save-button-dark"}`} 
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  {isSaving ? "...Saving" : "Save Sketch"}
                </button>

                <button 
                  className={`button ${theme === THEME.LIGHT ? "button-light" : "button-dark"}`} 
                  onClick={toggleTheme}
                >
                  {theme === THEME.LIGHT ? <Sun /> : <Moon />}
                </button>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default EhsaanDrawScreen;
