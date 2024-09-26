import React, { useEffect, useState, useContext } from "react";
import { database } from "../../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import CardList from "../CardList";
import { useNavigate, useLocation } from "react-router-dom";
import EditPage from "../EhsaanDrawSketch";
import { useGithub } from "../../githubContext";
import toast from "react-hot-toast";
import { SquarePlus, Search } from "lucide-react";
import SkeletonGrid from "../Skeleton";
import { ThemeContext } from "../../themeContext";
import '../../App.css'
import { useRef } from "react";
import { LogOut } from 'lucide-react';

const SketchGallery: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [scenes, setScenes] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [filteredValues, setFilteredValues] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [deleteValue, setDeleteValue] = useState<any>(""); 
  const [error, setError] = useState<boolean>(false);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { theme } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { githubId, logout, photoUrl, screenName } = useGithub();


  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const headerStyles: React.CSSProperties = {
    position: "sticky",
    top: "0",
    borderBottom: theme === "dark" ? "1px solid #444" : "1px solid #ccc",
    display: "flex",
    height: "4rem",
    alignItems: "center",
    justifyContent: "center",
    background: theme === "dark" ? "#121212" : "#fff",
    zIndex: 50,
    padding: "0.75rem 1rem",
    boxShadow: theme === "dark" ? "5px 5px 5px #000" : "5px 5px 5px gray",
  };

  const inputStyles: React.CSSProperties = {
    background: theme === "dark" ? "#333" : "#fff",
    color: theme === "dark" ? "#eee" : "#000",
    border: theme === "dark" ? "2px solid #555" : "2px solid #ccc",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "border-color 0.3s, box-shadow 0.3s",
    marginRight: "5px",
  };

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setError(false);
  };

  console.log(photoUrl)

  const handleCreateBoard = async () => {
    if (!userName.trim()) {
      setError(true);
      return;
    }

    setIsCreating(true);

    try {
      const sketchCollection = collection(database, "users", `${githubId}/scenes`);

      const addSketch = {
        userName1: userName,
        scenes1: [],
        createdAt: serverTimestamp(),
      };

      const createdSketchId = await addDoc(sketchCollection, addSketch);
      toast.success("Document created successfully");
      setError(false);
      setId(createdSketchId.id);
      setScenes([]);
      setUserName("");
      handleClose();
      navigate(`/edit/${createdSketchId.id}`);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document.");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const sketchData = collection(database, "users", `${githubId}/scenes`);
      const sketchSnap = await getDocs(sketchData);
      const fetchedValues = sketchSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIsLoading(false);
      setValues(fetchedValues);
      setFilteredValues(fetchedValues);
    };
    getData();
  }, [id, deleteValue]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = values.filter((item) =>
      item.userName1.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredValues(filtered);
  };

  const handleDelete = async (id: string) => {
    const deleteValue = doc(database, "users", `${githubId}/scenes`, id);
    setDeleteValue(deleteValue);
    await deleteDoc(deleteValue);
  };

  const handleEdit = async (id: string, userName: string, scenes: any[]) => {
    let scene: any[] = [];
    
    navigate(`/edit/${id}`);
    setScenes(scene);
    setId(id);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        background: theme === "dark" ? "#121212" : "#fff",
        color: theme === "dark" ? "#eee" : "#000",
      }}
    >
      <header style={headerStyles}>
        <h1
          className="ehsaandraw"
          style={{
            color: theme === "dark" ? "#fff" : "#000",
            fontSize: "3rem",
            fontWeight: "bold",
            letterSpacing: "2px",
            margin: 0,
          }}
        >
          EhsaanDraw
        </h1>

        <div
          style={{
            position: "absolute",
            right: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {openSearch && (
            <input
              placeholder="Search Document"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                ...inputStyles,
                width: "250px",
                padding: "8px",
                height: "24px",
                fontSize: "16px",
                borderRadius: "8px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#000")}
              onBlur={(e) =>
                (e.target.style.borderColor =
                  theme === "dark" ? "#555" : "#ccc")
              }
            />
          )}
          <Search
            size={34}
            color={theme === "dark" ? "#fff" : "#000"}
            style={{ cursor: "pointer" }}
            onClick={() => setOpenSearch(!openSearch)}
          />
          <SquarePlus
            onClick={handleOpen}
            size="42"
            color={theme === "dark" ? "#fff" : "#000"}
            strokeWidth={"1.3px"}
            style={{ marginLeft: "15px", cursor: "pointer" }}
          />
          {/* Profile Image that toggles the dropdown */}
          <div style={{ position: 'relative', marginLeft: '15px', marginTop:'3px' }} ref={dropdownRef}>
      {/* Profile Image that toggles the dropdown */}
      <img
        src={photoUrl} // Fallback image if no photoUrl
        alt=""
        onClick={toggleDropdown}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          cursor: 'pointer',
          border: theme === 'dark' ? '1px solid #fff' : '1px solid #000',
        }}
      />

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            right: '0',
            backgroundColor: '#FAF9F6',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '4px',
            width: '200px',
            zIndex: 10,
            padding:"10px"
          }}
        >
          <div
          style={{display: 'flex'}}
          >
            <div>
           <img
        src={photoUrl} // Fallback image if no photoUrl
        alt=""
        onClick={toggleDropdown}
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          cursor: 'pointer',
          border: theme === 'dark' ? '1px solid #fff' : '1px solid #000',
        }}
      />
      </div>

      <div style={{marginLeft:'5px', alignItems:'center',color:'#000'}}>
        {screenName}
        </div>
      </div>
      <div style={{display:'flex',borderTop: '1px solid #000',marginBottom:'10px'}}>
        <div style={{marginTop:'10px'}}>
      <LogOut color="#000"/>
      </div>
          <div
            style={{
              color:'#000',
              // padding: '10px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              marginTop: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              marginLeft:'10px',
            }}
            onClick={logout}
          >
            Logout
          </div>
        </div>
        </div>
      )}
    </div>
        </div>
      </header>

      <div>{location.pathname.startsWith("/edit") && <EditPage />}</div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={handleClose}
        >
          <div
            style={{
              backgroundColor: theme ==="dark" ? "#232329":"#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              maxWidth: "100%",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "bold",
                fontFamily: "sans-serif",
                textAlign: "center",
              }}
            >
              Document Details
            </h2>

            {/* Content */}
            <div>
              <div
                className="edit-container"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <input
                  type="text"
                  placeholder="Document Name"
                  value={userName}
                  maxLength={40}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateBoard();
                    }
                  }}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (error) {
                      setError(false);
                    }
                  }}
                  style={{
                    width: "93%",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    border: error ? "2px solid red" : "1px solid #ccc", 
                    marginBottom: "0", 
                  }}
                  required
                />
                {error && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      margin: "0",
                      marginBottom: "8px",
                      marginTop: "2px",
                      fontFamily:"sans-serif"
                    }}
                  >
                    Document name is required
                  </p>
                )}
              </div>
              <button
              className="create-button"
                onClick={handleCreateBoard}
                style={{
                  backgroundColor: theme === "dark" ? "#000":"#000",
                  color: theme ==="dark" ? "#fff" :"#fff",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                  marginTop: "25px",
                  fontFamily: "sans-serif",
                }}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create"}{" "}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#aaa",
                transition: "color 0.3s",
              }}
            
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          marginTop:"20px",
          flexDirection: "column",
        }}
      >
        {isLoading ? (
          <SkeletonGrid />
        ) : filteredValues.length > 0 ? (
          <CardList
            values={filteredValues}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ) : (
          <p style={{ color: theme === "dark" ? "#eee" : "#000",fontFamily:"sans-serif",fontSize:"20px" }}>
            No documents created so far.
          </p>
        )}
      </div>
    </div>
  );
};

export default SketchGallery;
