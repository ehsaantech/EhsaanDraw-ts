import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGithub } from "../../githubContext";
import ehsaan from "../../assets/ehsaan.png";
import "./index.css"; 

const GithubAuth: React.FC = () => {
  const { githubId, isLoading, handleGithubLogin } = useGithub();
  const navigate = useNavigate();

  useEffect(() => {
    if (githubId) {
      navigate("/");
    }
  }, [githubId, navigate]); 

  return (
    <div className="github-auth-container">
      <div className="github-auth-card">
        <div className="github-auth-content">
          <h3 className="github-auth-title">EhsaanDraw</h3>
          <img src={ehsaan} alt="EhsaanDraw" className="github-auth-image" />
          {
            isLoading ? (
              <div className="github-auth-loading">Loading...</div>
            )
              :
              <button className="github-auth-button" onClick={handleGithubLogin}>
              Login With GitHub
            </button>
            
          }
         
        </div>
      </div>
    </div>
  );
};

export default GithubAuth;
